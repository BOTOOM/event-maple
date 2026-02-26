"use client";

import { AlertTriangle, Check, Copy, Download, FileUp, Loader2, SkipForward, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { batchCreateTalks, batchUpsertTalks } from "@/lib/actions/talks";
import { Talk, TalkFormData } from "@/lib/types/talk";

type DuplicateAction = "skip" | "overwrite";

interface TalksImportProps {
	readonly eventId: number;
	readonly existingTalks: Talk[];
	readonly open: boolean;
	readonly onOpenChange: (open: boolean) => void;
}

interface ParsedTalk {
	title: string;
	date: string;
	start_time: string;
	end_time: string;
	short_description?: string;
	detailed_description?: string;
	speaker_name?: string;
	speaker_bio?: string;
	speaker_photo?: string;
	room?: string;
	floor?: string;
	tags?: string[];
	is_fixed?: boolean;
	level?: string;
	capacity?: number;
}

type ImportError = {
	row: number;
	message: string;
};

function parseCSV(text: string): ParsedTalk[] {
	const lines = text.trim().split("\n");
	if (lines.length < 2) return [];

	const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replaceAll(/['"]/g, ""));

	return lines.slice(1).map((line) => {
		const values: string[] = [];
		let current = "";
		let inQuotes = false;

		for (const char of line) {
			if (char === '"') {
				inQuotes = !inQuotes;
			} else if (char === "," && !inQuotes) {
				values.push(current.trim());
				current = "";
			} else {
				current += char;
			}
		}
		values.push(current.trim());

		const row: Record<string, string> = {};
		headers.forEach((header, i) => {
			row[header] = values[i] || "";
		});

		return {
			title: row.title || "",
			date: row.date || "",
			start_time: row.start_time || "",
			end_time: row.end_time || "",
			short_description: row.short_description || "",
			detailed_description: row.detailed_description || "",
			speaker_name: row.speaker_name || "",
			speaker_bio: row.speaker_bio || "",
			speaker_photo: row.speaker_photo || "",
			room: row.room || "",
			floor: row.floor || "",
			tags: row.tags ? row.tags.split(";").map((t) => t.trim()) : [],
			is_fixed: row.is_fixed === "true",
			level: row.level || "",
			capacity: row.capacity ? Number.parseInt(row.capacity, 10) : undefined,
		};
	});
}

function toStr(val: unknown): string {
	if (val == null) return "";
	if (typeof val === "string") return val;
	if (typeof val === "number" || typeof val === "boolean") return String(val);
	return "";
}

function parseTags(val: unknown): string[] {
	if (Array.isArray(val)) return val.map(toStr);
	if (typeof val === "string") return val.split(";").map((t) => t.trim());
	return [];
}

function parseJSON(text: string): ParsedTalk[] {
	const data = JSON.parse(text);
	const arr = Array.isArray(data) ? data : data.talks || [];

	return arr.map((item: Record<string, unknown>) => ({
		title: toStr(item.title),
		date: toStr(item.date),
		start_time: toStr(item.start_time),
		end_time: toStr(item.end_time),
		short_description: toStr(item.short_description),
		detailed_description: toStr(item.detailed_description),
		speaker_name: toStr(item.speaker_name),
		speaker_bio: toStr(item.speaker_bio),
		speaker_photo: toStr(item.speaker_photo),
		room: toStr(item.room),
		floor: toStr(item.floor),
		tags: parseTags(item.tags),
		is_fixed: Boolean(item.is_fixed),
		level: toStr(item.level),
		capacity: item.capacity ? Number(item.capacity) : undefined,
	}));
}

function validateTalks(talks: ParsedTalk[]): ImportError[] {
	const errors: ImportError[] = [];
	talks.forEach((talk, i) => {
		const row = i + 1;
		if (!talk.title) errors.push({ row, message: `Missing title` });
		if (!talk.date) errors.push({ row, message: `Missing date` });
		if (!talk.start_time) errors.push({ row, message: `Missing start_time` });
		if (!talk.end_time) errors.push({ row, message: `Missing end_time` });
		if (talk.start_time && talk.end_time && talk.end_time <= talk.start_time) {
			errors.push({ row, message: `end_time must be after start_time` });
		}
	});
	return errors;
}

const CSV_TEMPLATE = `title,date,start_time,end_time,room,floor,speaker_name,speaker_bio,short_description,tags,is_fixed,level,capacity
"Keynote: The Future of AI",2025-03-15,09:00,10:00,"Main Hall","Ground Floor","Jane Doe","AI researcher","Opening keynote about AI trends","ai;future;tech",false,"beginner",500
"Registration & Coffee",2025-03-15,08:00,09:00,"Lobby","Ground Floor","","","Registration and welcome coffee","",true,"",0`;

const JSON_TEMPLATE = JSON.stringify(
	{
		talks: [
			{
				title: "Keynote: The Future of AI",
				date: "2025-03-15",
				start_time: "09:00",
				end_time: "10:00",
				room: "Main Hall",
				floor: "Ground Floor",
				speaker_name: "Jane Doe",
				speaker_bio: "AI researcher",
				short_description: "Opening keynote about AI trends",
				tags: ["ai", "future", "tech"],
				is_fixed: false,
				level: "beginner",
				capacity: 500,
			},
		],
	},
	null,
	2,
);

function talkKey(title: string, date: string, startTime: string): string {
	return `${title.trim().toLowerCase()}|${date}|${startTime.slice(0, 5)}`;
}

function parsedToFormData(talk: ParsedTalk): Omit<TalkFormData, "event_id"> {
	return {
		title: talk.title,
		date: talk.date,
		start_time: talk.start_time,
		end_time: talk.end_time,
		short_description: talk.short_description || "",
		detailed_description: talk.detailed_description || "",
		speaker_name: talk.speaker_name || "",
		speaker_bio: talk.speaker_bio || "",
		speaker_photo: talk.speaker_photo || "",
		room: talk.room || "",
		floor: talk.floor || "",
		tags: talk.tags || [],
		is_fixed: talk.is_fixed || false,
		level: talk.level || "",
		capacity: talk.capacity || 0,
	};
}

export function TalksImport({ eventId, existingTalks, open, onOpenChange }: TalksImportProps) {
	const t = useTranslations("MyEvents.Talks");
	const { toast } = useToast();
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [parsedTalks, setParsedTalks] = useState<ParsedTalk[]>([]);
	const [errors, setErrors] = useState<ImportError[]>([]);
	const [fileName, setFileName] = useState("");
	const [isImporting, setIsImporting] = useState(false);
	const [step, setStep] = useState<"upload" | "preview">("upload");
	const [isDragging, setIsDragging] = useState(false);
	const [duplicateActions, setDuplicateActions] = useState<Record<number, DuplicateAction>>({});

	// Build a map of existing talks by key for O(1) lookup
	const existingMap = useMemo(() => {
		const map = new Map<string, Talk>();
		for (const talk of existingTalks) {
			map.set(talkKey(talk.title, talk.date, talk.start_time), talk);
		}
		return map;
	}, [existingTalks]);

	// Detect which parsed talks are duplicates
	const duplicateInfo = useMemo(() => {
		const info: Record<number, Talk> = {};
		parsedTalks.forEach((parsed, idx) => {
			const key = talkKey(parsed.title, parsed.date, parsed.start_time);
			const existing = existingMap.get(key);
			if (existing) info[idx] = existing;
		});
		return info;
	}, [parsedTalks, existingMap]);

	const duplicateCount = Object.keys(duplicateInfo).length;
	const hasDuplicates = duplicateCount > 0;

	// Count talks that will actually be imported
	const importableCount = useMemo(() => {
		let count = 0;
		parsedTalks.forEach((_, idx) => {
			if (duplicateInfo[idx]) {
				const action = duplicateActions[idx] ?? "skip";
				if (action !== "skip") count++;
			} else {
				count++;
			}
		});
		return count;
	}, [parsedTalks, duplicateInfo, duplicateActions]);

	const resetState = useCallback(() => {
		setParsedTalks([]);
		setErrors([]);
		setFileName("");
		setStep("upload");
		setIsImporting(false);
		setDuplicateActions({});
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, []);

	const handleClose = useCallback(
		(isOpen: boolean) => {
			if (!isOpen) resetState();
			onOpenChange(isOpen);
		},
		[onOpenChange, resetState],
	);

	const processFile = useCallback(
		async (file: File) => {
			const validExtensions = [".csv", ".json"];
			const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
			if (!hasValidExtension) {
				toast({ title: t("import.parseError"), variant: "destructive" });
				return;
			}

			setFileName(file.name);
			setDuplicateActions({});
			const text = await file.text();

			try {
				const parsed = file.name.toLowerCase().endsWith(".json")
					? parseJSON(text)
					: parseCSV(text);

				const validationErrors = validateTalks(parsed);
				setParsedTalks(parsed);
				setErrors(validationErrors);
				setStep("preview");
			} catch (err) {
				console.error("Error parsing file:", err);
				toast({ title: t("import.parseError"), variant: "destructive" });
			}
		},
		[t, toast],
	);

	const handleFileSelect = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) await processFile(file);
		},
		[processFile],
	);

	const handleDrop = useCallback(
		async (e: React.DragEvent<HTMLLabelElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) await processFile(file);
		},
		[processFile],
	);

	const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const setDuplicateAction = (idx: number, action: DuplicateAction) => {
		setDuplicateActions((prev) => ({ ...prev, [idx]: action }));
	};

	const setAllDuplicateActions = (action: DuplicateAction) => {
		const actions: Record<number, DuplicateAction> = {};
		for (const idx of Object.keys(duplicateInfo)) {
			actions[Number(idx)] = action;
		}
		setDuplicateActions(actions);
	};

	const handleImport = async () => {
		if (errors.length > 0 || importableCount === 0) return;

		setIsImporting(true);
		try {
			const newTalks: Omit<TalkFormData, "event_id">[] = [];
			const overwriteTalks: { id: number; data: Omit<TalkFormData, "event_id"> }[] = [];

			parsedTalks.forEach((parsed, idx) => {
				const existingTalk = duplicateInfo[idx];
				if (existingTalk) {
					const action = duplicateActions[idx] ?? "skip";
					if (action === "overwrite") {
						overwriteTalks.push({ id: existingTalk.id, data: parsedToFormData(parsed) });
					}
					// skip: do nothing
				} else {
					newTalks.push(parsedToFormData(parsed));
				}
			});

			// Use upsert if there are overwrites, otherwise simple batch create
			if (overwriteTalks.length > 0) {
				const result = await batchUpsertTalks(eventId, newTalks, overwriteTalks);
				if (result.success) {
					toast({
						title: t("import.successUpsert", { created: result.created, updated: result.updated }),
					});
					handleClose(false);
					router.refresh();
				} else {
					toast({ title: t("import.error"), description: result.error, variant: "destructive" });
				}
			} else {
				const result = await batchCreateTalks(eventId, newTalks);
				if (result.success) {
					toast({ title: t("import.success", { count: result.count ?? 0 }) });
					handleClose(false);
					router.refresh();
				} else {
					toast({ title: t("import.error"), description: result.error, variant: "destructive" });
				}
			}
		} catch (err) {
			console.error("Error importing talks:", err);
			toast({ title: t("import.error"), variant: "destructive" });
		} finally {
			setIsImporting(false);
		}
	};

	const downloadTemplate = (format: "csv" | "json") => {
		const content = format === "csv" ? CSV_TEMPLATE : JSON_TEMPLATE;
		const mimeType = format === "csv" ? "text/csv" : "application/json";
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `talks-template.${format}`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t("import.title")}</DialogTitle>
					<DialogDescription>{t("import.description")}</DialogDescription>
				</DialogHeader>

				{step === "upload" && (
					<div className="space-y-6 py-4">
						<div className="flex gap-2 justify-center">
							<Button
								variant="outline"
								size="sm"
								onClick={() => downloadTemplate("csv")}
								className="gap-2"
							>
								<Download className="h-4 w-4" />
								{t("import.downloadCSV")}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => downloadTemplate("json")}
								className="gap-2"
							>
								<Download className="h-4 w-4" />
								{t("import.downloadJSON")}
							</Button>
						</div>

						<label
							htmlFor="talks-import-file"
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/10" : "bg-muted/30 hover:bg-muted/50"}`}
						>
							<div className="flex flex-col items-center gap-2">
								<FileUp className="h-8 w-8 text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									{t("import.dropzone")}
								</p>
								<p className="text-xs text-muted-foreground">CSV, JSON</p>
							</div>
							<input
								ref={fileInputRef}
								id="talks-import-file"
								type="file"
								accept=".csv,.json"
								className="hidden"
								onChange={handleFileSelect}
							/>
						</label>
					</div>
				)}

				{step === "preview" && (
					<div className="space-y-4 py-4">
						<div className="flex items-center justify-between text-sm">
							<span className="font-medium">{fileName}</span>
							<Button variant="ghost" size="sm" onClick={resetState} className="gap-1">
								<X className="h-3 w-3" />
								{t("import.changeFile")}
							</Button>
						</div>

						{errors.length > 0 && (
							<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 space-y-1">
								<p className="text-sm font-medium text-destructive">
									{t("import.errorsFound", { count: errors.length })}
								</p>
								<ul className="text-xs text-destructive/80 space-y-0.5 max-h-24 overflow-y-auto">
									{errors.map((err) => (
										<li key={`err-${err.row}-${err.message}`}>
											Row {err.row}: {err.message}
										</li>
									))}
								</ul>
							</div>
						)}

						{hasDuplicates && (
							<div className="rounded-lg border border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 p-4 space-y-3">
								<div className="flex items-start gap-2">
									<AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
									<p className="text-sm font-medium text-amber-800 dark:text-amber-200">
										{t("import.duplicatesFound", { count: duplicateCount })}
									</p>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setAllDuplicateActions("skip")}
										className="gap-1.5 text-xs"
									>
										<SkipForward className="h-3 w-3" />
										{t("import.skipAll")}
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setAllDuplicateActions("overwrite")}
										className="gap-1.5 text-xs"
									>
										<Copy className="h-3 w-3" />
										{t("import.overwriteAll")}
									</Button>
								</div>
							</div>
						)}

						<div className="rounded-lg border overflow-hidden">
							<div className="max-h-60 overflow-y-auto">
								<table className="w-full text-xs">
									<thead className="bg-muted/50 sticky top-0">
										<tr>
											<th className="px-3 py-2 text-left font-medium">#</th>
											<th className="px-3 py-2 text-left font-medium">{t("import.status")}</th>
											<th className="px-3 py-2 text-left font-medium">{t("fields.title")}</th>
											<th className="px-3 py-2 text-left font-medium">{t("fields.date")}</th>
											<th className="px-3 py-2 text-left font-medium">{t("fields.startTime")}</th>
											<th className="px-3 py-2 text-left font-medium">{t("fields.room")}</th>
											{hasDuplicates && (
												<th className="px-3 py-2 text-right font-medium" />
											)}
										</tr>
									</thead>
									<tbody className="divide-y">
										{parsedTalks.map((talk, idx) => {
											const isDuplicate = !!duplicateInfo[idx];
											const action = duplicateActions[idx] ?? "skip";
											const isSkipped = isDuplicate && action === "skip";
											const rowClassName = (() => {
												if (isSkipped) {
													return "bg-muted/20 opacity-50";
												}

												if (isDuplicate && action === "overwrite") {
													return "bg-amber-50/50 dark:bg-amber-950/10";
												}

												return "hover:bg-muted/30";
											})();

											const statusBadge = (() => {
												if (!isDuplicate) {
													return (
														<Badge
															variant="secondary"
															className="text-[10px] gap-1 px-1.5 py-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-300"
														>
															<Check className="h-2.5 w-2.5" />
															{t("import.new")}
														</Badge>
													);
												}

												if (isSkipped) {
													return (
														<Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0">
															<SkipForward className="h-2.5 w-2.5" />
															{t("import.actionSkipped")}
														</Badge>
													);
												}

												return (
													<Badge
														variant="secondary"
														className="text-[10px] gap-1 px-1.5 py-0 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-300"
													>
														<Copy className="h-2.5 w-2.5" />
														{t("import.actionOverwrite")}
													</Badge>
												);
											})();

											return (
												<tr
													key={`${talk.title}-${talk.date}-${talk.start_time}-${idx}`}
													className={rowClassName}
												>
													<td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
													<td className="px-3 py-2">{statusBadge}</td>
													<td className="px-3 py-2 font-medium truncate max-w-[140px]">{talk.title}</td>
													<td className="px-3 py-2">{talk.date}</td>
													<td className="px-3 py-2">{talk.start_time}</td>
													<td className="px-3 py-2 truncate max-w-[80px]">{talk.room || "—"}</td>
													{hasDuplicates && (
														<td className="px-3 py-2 text-right">
															{isDuplicate && (
																<div className="flex gap-1 justify-end">
																	<Button
																		variant={action === "skip" ? "secondary" : "ghost"}
																		size="sm"
																		className="h-6 px-2 text-[10px]"
																		onClick={() => setDuplicateAction(idx, "skip")}
																	>
																		{t("import.actionSkip")}
																	</Button>
																	<Button
																		variant={action === "overwrite" ? "secondary" : "ghost"}
																		size="sm"
																		className="h-6 px-2 text-[10px]"
																		onClick={() => setDuplicateAction(idx, "overwrite")}
																	>
																		{t("import.actionOverwrite")}
																	</Button>
																</div>
															)}
														</td>
													)}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>

						<p className="text-sm text-muted-foreground text-center">
							{t("import.preview", { count: importableCount })}
						</p>
					</div>
				)}

				<DialogFooter>
					<Button variant="outline" onClick={() => handleClose(false)}>
						{t("actions.cancel")}
					</Button>
					{step === "preview" && (
						<Button
							onClick={handleImport}
							disabled={isImporting || errors.length > 0 || importableCount === 0}
							className="gap-2"
						>
							{isImporting && <Loader2 className="h-4 w-4 animate-spin" />}
							{isImporting
								? t("import.importing")
								: t("import.confirm", { count: importableCount })}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
