"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Save, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EventCategoryWithTranslation, EventFormData, EventStatus } from "@/lib/types/event";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { EventPreviewCard } from "./event-preview-card";
import { cn } from "@/lib/utils";

interface EventFormClientProps {
	readonly categories: EventCategoryWithTranslation[];
	readonly locale: string;
	readonly mode: "create" | "edit";
	readonly initialData?: Partial<EventFormData> & { id?: number };
}

const TIMEZONES = [
	{ value: "America/New_York", label: "America/New York (EST)" },
	{ value: "America/Chicago", label: "America/Chicago (CST)" },
	{ value: "America/Denver", label: "America/Denver (MST)" },
	{ value: "America/Los_Angeles", label: "America/Los Angeles (PST)" },
	{ value: "America/Bogota", label: "America/Bogota (COT)" },
	{ value: "America/Sao_Paulo", label: "America/São Paulo (BRT)" },
	{ value: "America/Mexico_City", label: "America/Mexico City (CST)" },
	{ value: "Europe/London", label: "Europe/London (GMT)" },
	{ value: "Europe/Paris", label: "Europe/Paris (CET)" },
	{ value: "Europe/Madrid", label: "Europe/Madrid (CET)" },
	{ value: "Europe/Berlin", label: "Europe/Berlin (CET)" },
	{ value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
	{ value: "Asia/Shanghai", label: "Asia/Shanghai (CST)" },
	{ value: "Australia/Sydney", label: "Australia/Sydney (AEST)" },
	{ value: "UTC", label: "UTC" },
];

const COUNTRIES = [
	{ code: "US", name: "United States" },
	{ code: "ES", name: "Spain" },
	{ code: "MX", name: "Mexico" },
	{ code: "CO", name: "Colombia" },
	{ code: "AR", name: "Argentina" },
	{ code: "BR", name: "Brazil" },
	{ code: "FR", name: "France" },
	{ code: "DE", name: "Germany" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "IT", name: "Italy" },
	{ code: "PT", name: "Portugal" },
	{ code: "JP", name: "Japan" },
	{ code: "CN", name: "China" },
	{ code: "AU", name: "Australia" },
	{ code: "CA", name: "Canada" },
];

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
	const [formData, setFormData] = useState<EventFormData>({
		name: initialData?.name || "",
		description: initialData?.description || "",
		start_at: initialData?.start_at || "",
		end_at: initialData?.end_at || "",
		timezone: initialData?.timezone || "UTC",
		country_code: initialData?.country_code || "",
		location: initialData?.location || "",
		image_url: initialData?.image_url || "",
		category_id: initialData?.category_id || "",
		status: initialData?.status || "draft",
	});

	const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (status: EventStatus) => {
		setIsSubmitting(true);

		const dataToSubmit = { ...formData, status };

		try {
			if (mode === "create") {
				const result = await createEvent(dataToSubmit);
				if (result.success) {
					toast({
						title: status === "published" ? t("publishSuccess") : t("saveSuccess"),
					});
					router.push("/my-events");
				} else {
					toast({
						title: t("error"),
						description: result.error,
						variant: "destructive",
					});
				}
			} else if (initialData?.id) {
				const result = await updateEvent(initialData.id, dataToSubmit);
				if (result.success) {
					toast({
						title: status === "published" ? t("publishSuccess") : t("updateSuccess"),
					});
					router.push("/my-events");
				} else {
					toast({
						title: t("error"),
						description: result.error,
						variant: "destructive",
					});
				}
			}
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
												: "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
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
							<span className="text-gray-400 text-sm ml-2">
								({t("recommended")}: 1200x600)
							</span>
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
							<select
								id="country_code"
								value={formData.country_code}
								onChange={(e) => updateField("country_code", e.target.value)}
								className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">{t("placeholders.selectCountry")}</option>
								{COUNTRIES.map((country) => (
									<option key={country.code} value={country.code}>
										{country.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<Label htmlFor="timezone">{t("fields.timezone")}</Label>
							<select
								id="timezone"
								value={formData.timezone}
								onChange={(e) => updateField("timezone", e.target.value)}
								className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{TIMEZONES.map((tz) => (
									<option key={tz.value} value={tz.value}>
										{tz.label}
									</option>
								))}
							</select>
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
						<span className="text-sm font-medium text-gray-700">
							{t("preview.title")}
						</span>
						<span className="text-xs text-gray-400 ml-auto">
							{t("preview.desktop")}
						</span>
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
