"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createTalk, updateTalk, type TalkFieldSuggestions } from "@/lib/actions/talks";
import type { Talk, TalkFormData } from "@/lib/types/talk";

interface TalkFormProps {
	readonly eventId: number;
	readonly talk?: Talk;
	readonly suggestions?: TalkFieldSuggestions;
	readonly onSuccess: () => void;
	readonly onCancel: () => void;
}

function toTimeValue(value: string): string {
	return value ? value.slice(0, 5) : "";
}

function toNullableNumber(value: string): number {
	const trimmed = value.trim();
	if (!trimmed) return 0;
	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTags(value: string): string[] {
	if (!value.trim()) return [];
	return value
		.split(/[,;]+/)
		.map((tag) => tag.trim())
		.filter(Boolean);
}

export function TalkForm({ eventId, talk, suggestions, onSuccess, onCancel }: Readonly<TalkFormProps>) {
	const t = useTranslations("MyEvents.Talks");
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [tagsInput, setTagsInput] = useState(talk?.tags?.join(", ") ?? "");
	const [formData, setFormData] = useState<TalkFormData>({
		event_id: eventId,
		title: talk?.title ?? "",
		short_description: talk?.short_description ?? "",
		detailed_description: talk?.detailed_description ?? "",
		date: talk?.date ?? "",
		start_time: toTimeValue(talk?.start_time ?? ""),
		end_time: toTimeValue(talk?.end_time ?? ""),
		room: talk?.room ?? "",
		floor: talk?.floor ?? "",
		speaker_name: talk?.speaker_name ?? "",
		speaker_bio: talk?.speaker_bio ?? "",
		speaker_photo: talk?.speaker_photo ?? "",
		tags: talk?.tags ?? [],
		is_fixed: talk?.is_fixed ?? false,
		level: talk?.level ?? "",
		capacity: talk?.capacity ?? 0,
	});

	const updateField = <K extends keyof TalkFormData>(field: K, value: TalkFormData[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const validateForm = (): string | null => {
		if (!formData.title.trim()) return t("validation.titleRequired");
		if (!formData.date) return t("validation.dateRequired");
		if (!formData.start_time || !formData.end_time) return t("validation.timeRequired");
		if (formData.end_time <= formData.start_time) return t("validation.timeOrder");
		return null;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const validationError = validateForm();
		if (validationError) {
			toast({
				title: t("messages.errorTitle"),
				description: validationError,
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);
		const payload: TalkFormData = {
			...formData,
			tags: normalizeTags(tagsInput),
		};

		try {
			const result = talk
				? await updateTalk(talk.id, payload)
				: await createTalk(payload);

			if (!result.success) {
				toast({
					title: t("messages.errorTitle"),
					description: result.error ?? t("messages.unexpectedError"),
					variant: "destructive",
				});
				return;
			}

			toast({
				title: t("messages.successTitle"),
				description: talk ? t("messages.updateSuccess") : t("messages.createSuccess"),
			});
			onSuccess();
		} catch {
			toast({
				title: t("messages.errorTitle"),
				description: t("messages.unexpectedError"),
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="talk-title">{t("fields.title")}</Label>
				<Input
					id="talk-title"
					value={formData.title}
					onChange={(event) => updateField("title", event.target.value)}
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="talk-date">{t("fields.date")}</Label>
					<Input
						id="talk-date"
						type="date"
						value={formData.date}
						onChange={(event) => updateField("date", event.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="talk-room">{t("fields.room")}</Label>
					<Input
						id="talk-room"
						value={formData.room}
						list="talk-room-suggestions"
						onChange={(event) => updateField("room", event.target.value)}
						placeholder={t("placeholders.room")}
					/>
					<datalist id="talk-room-suggestions">
						{suggestions?.rooms.map((room) => (
							<option key={room} value={room} />
						))}
					</datalist>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="talk-start-time">{t("fields.startTime")}</Label>
					<Input
						id="talk-start-time"
						type="time"
						value={formData.start_time}
						onChange={(event) => updateField("start_time", event.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="talk-end-time">{t("fields.endTime")}</Label>
					<Input
						id="talk-end-time"
						type="time"
						value={formData.end_time}
						onChange={(event) => updateField("end_time", event.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="talk-floor">{t("fields.floor")}</Label>
					<Input
						id="talk-floor"
						value={formData.floor}
						list="talk-floor-suggestions"
						onChange={(event) => updateField("floor", event.target.value)}
						placeholder={t("placeholders.floor")}
					/>
					<datalist id="talk-floor-suggestions">
						{suggestions?.floors.map((floor) => (
							<option key={floor} value={floor} />
						))}
					</datalist>
				</div>
				<div className="space-y-2">
					<Label htmlFor="talk-level">{t("fields.level")}</Label>
					<Input
						id="talk-level"
						value={formData.level}
						list="talk-level-suggestions"
						onChange={(event) => updateField("level", event.target.value)}
						placeholder={t("placeholders.level")}
					/>
					<datalist id="talk-level-suggestions">
						{suggestions?.levels.map((level) => (
							<option key={level} value={level} />
						))}
					</datalist>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="talk-speaker-name">{t("fields.speakerName")}</Label>
					<Input
						id="talk-speaker-name"
						value={formData.speaker_name}
						onChange={(event) => updateField("speaker_name", event.target.value)}
						placeholder={t("placeholders.speakerName")}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="talk-speaker-photo">{t("fields.speakerPhoto")}</Label>
					<Input
						id="talk-speaker-photo"
						type="url"
						value={formData.speaker_photo}
						onChange={(event) => updateField("speaker_photo", event.target.value)}
						placeholder={t("placeholders.speakerPhoto")}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="talk-speaker-bio">{t("fields.speakerBio")}</Label>
				<Textarea
					id="talk-speaker-bio"
					value={formData.speaker_bio}
					onChange={(event) => updateField("speaker_bio", event.target.value)}
					placeholder={t("placeholders.speakerBio")}
					rows={3}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="talk-short-description">{t("fields.shortDescription")}</Label>
				<Textarea
					id="talk-short-description"
					value={formData.short_description}
					onChange={(event) => updateField("short_description", event.target.value)}
					placeholder={t("placeholders.shortDescription")}
					rows={2}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="talk-detailed-description">{t("fields.detailedDescription")}</Label>
				<Textarea
					id="talk-detailed-description"
					value={formData.detailed_description}
					onChange={(event) => updateField("detailed_description", event.target.value)}
					placeholder={t("placeholders.detailedDescription")}
					rows={4}
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="talk-tags">{t("fields.tags")}</Label>
					<Input
						id="talk-tags"
						value={tagsInput}
						list="talk-tags-suggestions"
						onChange={(event) => setTagsInput(event.target.value)}
						placeholder={t("placeholders.tags")}
					/>
					<datalist id="talk-tags-suggestions">
						{suggestions?.tags.map((tag) => (
							<option key={tag} value={tag} />
						))}
					</datalist>
				</div>
				<div className="space-y-2">
					<Label htmlFor="talk-capacity">{t("fields.capacity")}</Label>
					<Input
						id="talk-capacity"
						type="number"
						min={0}
						value={String(formData.capacity)}
						onChange={(event) => updateField("capacity", toNullableNumber(event.target.value))}
						placeholder={t("placeholders.capacity")}
					/>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<input
					id="talk-is-fixed"
					type="checkbox"
					className="h-4 w-4"
					checked={formData.is_fixed}
					onChange={(event) => updateField("is_fixed", event.target.checked)}
				/>
				<Label htmlFor="talk-is-fixed">{t("fields.isFixed")}</Label>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
					{t("actions.cancel")}
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? t("actions.saving") : t("actions.save")}
				</Button>
			</div>
		</form>
	);
}
