"use client";

import { Edit, FileUp, Plus, Trash2, Calendar, Clock, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { deleteTalk } from "@/lib/actions/talks";
import type { TalkFieldSuggestions } from "@/lib/actions/talks";
import { Talk } from "@/lib/types/talk";
import { TalkForm } from "./talk-form";
import { TalksImport } from "./talks-import";

interface TalksManagerProps {
	readonly eventId: number;
	readonly talks: Talk[];
	readonly locale: string;
	readonly talkSuggestions?: TalkFieldSuggestions;
}

export function TalksManager({ eventId, talks, locale, talkSuggestions }: TalksManagerProps) {
	const t = useTranslations("MyEvents.Talks");
	const router = useRouter();
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [editingTalk, setEditingTalk] = useState<Talk | undefined>(undefined);
	const [deletingTalkId, setDeletingTalkId] = useState<number | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isImportOpen, setIsImportOpen] = useState(false);

	const handleAddTalk = () => {
		setEditingTalk(undefined);
		setIsSheetOpen(true);
	};

	const handleEditTalk = (talk: Talk) => {
		setEditingTalk(talk);
		setIsSheetOpen(true);
	};

	const handleDeleteClick = (talkId: number) => {
		setDeletingTalkId(talkId);
	};

	const confirmDelete = async () => {
		if (!deletingTalkId) return;

		setIsDeleting(true);
		try {
			await deleteTalk(deletingTalkId);
			setDeletingTalkId(null);
			router.refresh();
		} catch (error) {
			console.error("Failed to delete talk", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleFormSuccess = () => {
		setIsSheetOpen(false);
		router.refresh();
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
					<p className="text-muted-foreground">{t("subtitle")}</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => setIsImportOpen(true)}
						className="gap-2"
						data-testid="talks-import-button"
					>
						<FileUp className="h-4 w-4" />
						{t("import.button")}
					</Button>
					<Button onClick={handleAddTalk} className="gap-2" data-testid="talks-add-button">
						<Plus className="h-4 w-4" />
						{t("add")}
					</Button>
				</div>
			</div>

			{talks.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<Calendar className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="mt-4 text-lg font-semibold">{t("empty")}</h3>
					<p className="mt-2 text-sm text-muted-foreground max-w-sm">{t("emptyDesc")}</p>
					<Button
						onClick={handleAddTalk}
						variant="outline"
						className="mt-4 gap-2"
						data-testid="talks-add-empty-button"
					>
						<Plus className="h-4 w-4" />
						{t("add")}
					</Button>
				</div>
			) : (
				<div className="grid gap-4">
					{talks.map((talk) => (
						<div
							key={talk.id}
							className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border p-4 bg-card hover:bg-accent/5 transition-colors"
						>
							<div className="flex-1 min-w-0 space-y-1">
								<div className="flex items-center gap-2">
									<span className="font-semibold truncate">{talk.title}</span>
									{talk.is_fixed && (
										<span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
											Fixed
										</span>
									)}
								</div>
								<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<Calendar className="h-3 w-3" />
										<span>{new Date(talk.date).toLocaleDateString(locale)}</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										<span>
											{talk.start_time.slice(0, 5)} - {talk.end_time.slice(0, 5)}
										</span>
									</div>
									{(talk.room || talk.floor) && (
										<div className="flex items-center gap-1">
											<MapPin className="h-3 w-3" />
											<span>
												{[talk.room, talk.floor].filter(Boolean).join(", ")}
											</span>
										</div>
									)}
									{talk.speaker_name && (
										<div className="flex items-center gap-1">
											<User className="h-3 w-3" />
											<span>{talk.speaker_name}</span>
										</div>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2 w-full sm:w-auto justify-end">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleEditTalk(talk)}
									title={t("edit")}
								>
									<Edit className="h-4 w-4" />
									<span className="sr-only">{t("edit")}</span>
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="text-destructive hover:text-destructive hover:bg-destructive/10"
									onClick={() => handleDeleteClick(talk.id)}
									title={t("delete")}
								>
									<Trash2 className="h-4 w-4" />
									<span className="sr-only">{t("delete")}</span>
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetContent className="sm:max-w-xl overflow-y-auto">
					<SheetHeader className="mb-6">
						<SheetTitle>{editingTalk ? t("edit") : t("add")}</SheetTitle>
						<SheetDescription>
							{editingTalk ? editingTalk.title : t("subtitle")}
						</SheetDescription>
					</SheetHeader>
					<TalkForm
						eventId={eventId}
						talk={editingTalk}
						suggestions={talkSuggestions}
						onSuccess={handleFormSuccess}
						onCancel={() => setIsSheetOpen(false)}
					/>
				</SheetContent>
			</Sheet>

			<Dialog open={!!deletingTalkId} onOpenChange={(open) => !open && setDeletingTalkId(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("delete")}</DialogTitle>
						<DialogDescription>
							{t("deleteConfirm")}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeletingTalkId(null)}
							disabled={isDeleting}
						>
							{t("actions.cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={confirmDelete}
							disabled={isDeleting}
						>
							{isDeleting ? t("actions.deleting") : t("delete")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<TalksImport
				eventId={eventId}
				existingTalks={talks}
				open={isImportOpen}
				onOpenChange={setIsImportOpen}
			/>
		</div>
	);
}
