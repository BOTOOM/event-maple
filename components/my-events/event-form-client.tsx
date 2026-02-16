"use client";

import { Save, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { COUNTRIES } from "@/lib/data/countries";
import { formatTimezoneLabel, TIMEZONES } from "@/lib/data/timezones";
import { EventCategoryWithTranslation, EventFormData, EventStatus } from "@/lib/types/event";
import { cn } from "@/lib/utils";
import { convertLocalToUTC, getBrowserTimezone } from "@/lib/utils/date";
import { EventPreviewCard } from "./event-preview-card";

interface EventFormClientProps {
	readonly categories: EventCategoryWithTranslation[];
	readonly locale: string;
	readonly mode: "create" | "edit";
	readonly initialData?: Partial<EventFormData> & { id?: number };
}

export function EventFormClient({
	categories,
	locale,
	mode,
	initialData,
}: Readonly<EventFormClientProps>) {
	const t = useTranslations("MyEvents.Form");
	const router = useRouter();
	const { toast } = useToast();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<EventFormData>(() => {
		// For create mode, we'll set the browser timezone after mount
		// For edit mode, use the event's stored timezone
		const defaultTimezone = initialData?.timezone || "UTC";
		return {
			name: initialData?.name || "",
			description: initialData?.description || "",
			start_at: initialData?.start_at || "",
			end_at: initialData?.end_at || "",
			timezone: defaultTimezone,
			country_code: initialData?.country_code || "",
			location: initialData?.location || "",
			image_url: initialData?.image_url || "",
			category_id: initialData?.category_id || "",
			status: initialData?.status || "draft",
		};
	});

	// Auto-detect browser timezone for new events
	useEffect(() => {
		if (mode === "create" && !initialData?.timezone) {
			const browserTz = getBrowserTimezone();
			// Check if the browser timezone exists in our list
			const tzExists = TIMEZONES.some((tz) => tz.value === browserTz);
			if (tzExists) {
				setFormData((prev) => ({ ...prev, timezone: browserTz }));
			}
		}
	}, [mode, initialData?.timezone]);

	const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const buildSubmissionData = (status: EventStatus): EventFormData => {
		const startAtUTC = formData.start_at
			? convertLocalToUTC(formData.start_at, formData.timezone)
			: "";
		const endAtUTC = formData.end_at ? convertLocalToUTC(formData.end_at, formData.timezone) : "";

		return {
			...formData,
			start_at: startAtUTC,
			end_at: endAtUTC,
			status,
		};
	};

	const submitEvent = async (dataToSubmit: EventFormData) => {
		if (mode === "create") {
			return createEvent(dataToSubmit);
		}

		if (!initialData?.id) {
			return {
				success: false,
				error: t("unexpectedError"),
			};
		}

		return updateEvent(initialData.id, dataToSubmit);
	};

	const getSuccessTitle = (status: EventStatus) => {
		if (status === "published") {
			return t("publishSuccess");
		}

		return mode === "create" ? t("saveSuccess") : t("updateSuccess");
	};

	const handleSubmit = async (status: EventStatus) => {
		setIsSubmitting(true);
		const dataToSubmit = buildSubmissionData(status);

		try {
			const result = await submitEvent(dataToSubmit);
			if (result.success) {
				toast({
					title: getSuccessTitle(status),
				});
				router.push("/my-events");
				return;
			}

			toast({
				title: t("error"),
				description: result.error,
				variant: "destructive",
			});
		} catch {
			toast({
				title: t("error"),
				description: t("unexpectedError"),
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const selectedCategory = categories.find((c) => c.id === formData.category_id);

	const countryOptions = useMemo(
		() =>
			COUNTRIES.map((country) => ({
				value: country.code,
				label: country.name,
				searchTerms: `${country.name} ${country.code}`,
			})),
		[],
	);

	const timezoneOptions = useMemo(
		() =>
			TIMEZONES.map((tz) => ({
				value: tz.value,
				label: formatTimezoneLabel(tz),
				searchTerms: `${tz.label} ${tz.value} ${tz.offset}`,
			})),
		[],
	);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			{/* Form Section */}
			<div className="lg:col-span-2 space-y-6">
				{/* Action Buttons */}
				<div className="flex flex-wrap gap-3 justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={() => handleSubmit("draft")}
						disabled={isSubmitting}
						className="gap-2"
					>
						<Save className="h-4 w-4" />
						{t("saveDraft")}
					</Button>
					{formData.status === "published" && (
						<Button
							type="button"
							variant="destructive"
							onClick={() => handleSubmit("draft")}
							disabled={isSubmitting}
							className="gap-2"
						>
							<X className="h-4 w-4" />
							{t("unpublish")}
						</Button>
					)}
					<Button
						type="button"
						onClick={() => handleSubmit("published")}
						disabled={isSubmitting}
						className="gap-2"
					>
						<Send className="h-4 w-4" />
						{t("publish")}
					</Button>
				</div>

				{/* General Details */}
				<div className="bg-white rounded-lg border p-6 space-y-4">
					<h2 className="text-lg font-semibold flex items-center gap-2">
						<span className="text-blue-600">✏️</span>
						{t("sections.general")}
					</h2>

					<div className="space-y-4">
						<div>
							<Label htmlFor="name">{t("fields.name")}</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => updateField("name", e.target.value)}
								placeholder={t("placeholders.name")}
								className="mt-1"
							/>
						</div>

						<div>
							<Label>{t("fields.category")}</Label>
							<div className="flex flex-wrap gap-2 mt-2">
								{categories.map((category) => (
									<button
										key={category.id}
										type="button"
										onClick={() => updateField("category_id", category.id)}
										className={cn(
											"px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
											formData.category_id === category.id
												? "bg-blue-600 text-white border-blue-600"
												: "bg-white text-gray-700 border-gray-300 hover:border-blue-400",
										)}
									>
										{category.name}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Multimedia */}
				<div className="bg-white rounded-lg border p-6 space-y-4">
					<h2 className="text-lg font-semibold flex items-center gap-2">
						<span className="text-blue-600">🖼️</span>
						{t("sections.multimedia")}
					</h2>

					<div>
						<Label htmlFor="image_url">
							{t("fields.imageUrl")}
							<span className="text-gray-400 text-sm ml-2">({t("recommended")}: 1200x600)</span>
						</Label>
						<Input
							id="image_url"
							type="url"
							value={formData.image_url}
							onChange={(e) => updateField("image_url", e.target.value)}
							placeholder={t("placeholders.imageUrl")}
							className="mt-1"
						/>
					</div>
				</div>

				{/* Date and Location */}
				<div className="bg-white rounded-lg border p-6 space-y-4">
					<h2 className="text-lg font-semibold flex items-center gap-2">
						<span className="text-blue-600">📍</span>
						{t("sections.dateLocation")}
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="start_at">{t("fields.startDate")}</Label>
							<Input
								id="start_at"
								type="datetime-local"
								value={formData.start_at}
								onChange={(e) => updateField("start_at", e.target.value)}
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="end_at">{t("fields.endDate")}</Label>
							<Input
								id="end_at"
								type="datetime-local"
								value={formData.end_at}
								onChange={(e) => updateField("end_at", e.target.value)}
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="country_code">{t("fields.country")}</Label>
							<div className="mt-1">
								<Autocomplete
									options={countryOptions}
									value={formData.country_code}
									onChange={(value) => updateField("country_code", value)}
									placeholder={t("placeholders.selectCountry")}
									searchPlaceholder={t("placeholders.searchCountry")}
									emptyMessage={t("placeholders.noCountryFound")}
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="timezone">{t("fields.timezone")}</Label>
							<div className="mt-1">
								<Autocomplete
									options={timezoneOptions}
									value={formData.timezone}
									onChange={(value) => updateField("timezone", value || "UTC")}
									placeholder={t("placeholders.selectTimezone")}
									searchPlaceholder={t("placeholders.searchTimezone")}
									emptyMessage={t("placeholders.noTimezoneFound")}
								/>
							</div>
						</div>
					</div>

					<div>
						<Label htmlFor="location">{t("fields.location")}</Label>
						<Input
							id="location"
							value={formData.location}
							onChange={(e) => updateField("location", e.target.value)}
							placeholder={t("placeholders.location")}
							className="mt-1"
						/>
					</div>
				</div>

				{/* Description */}
				<div className="bg-white rounded-lg border p-6 space-y-4">
					<h2 className="text-lg font-semibold flex items-center gap-2">
						<span className="text-blue-600">📝</span>
						{t("sections.description")}
					</h2>

					<div>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) => updateField("description", e.target.value)}
							placeholder={t("placeholders.description")}
							rows={6}
							className="mt-1"
						/>
					</div>
				</div>
			</div>

			{/* Preview Section */}
			<div className="lg:col-span-1">
				<div className="sticky top-4">
					<div className="flex items-center gap-2 mb-4">
						<span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
						<span className="text-sm font-medium text-gray-700">{t("preview.title")}</span>
						<span className="text-xs text-gray-400 ml-auto">{t("preview.desktop")}</span>
					</div>

					<EventPreviewCard
						name={formData.name}
						description={formData.description}
						startAt={formData.start_at}
						endAt={formData.end_at}
						timezone={formData.timezone}
						location={formData.location}
						imageUrl={formData.image_url}
						categoryName={selectedCategory?.name}
						locale={locale}
					/>

					<p className="text-xs text-blue-600 mt-4 flex items-center gap-1">
						<span>ℹ️</span>
						{t("preview.hint")}
					</p>
				</div>
			</div>
		</div>
	);
}
