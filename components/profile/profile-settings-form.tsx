"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateCurrentUserProfile } from "@/lib/actions/profile";
import { formatTimezoneLabel, TIMEZONES } from "@/lib/data/timezones";
import { useRouter } from "@/lib/i18n/navigation";
import { PROFILE_LOCALES, type UserProfile } from "@/lib/types/profile";

interface ProfileSettingsFormProps {
	readonly initialProfile: UserProfile;
}

export function ProfileSettingsForm({ initialProfile }: Readonly<ProfileSettingsFormProps>) {
	const locale = useLocale();
	const router = useRouter();
	const t = useTranslations("Profile");
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	const [displayName, setDisplayName] = useState(initialProfile.display_name || "");
	const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || "");
	const [preferredLocale, setPreferredLocale] = useState(initialProfile.locale);
	const [timezone, setTimezone] = useState(initialProfile.timezone);

	const timezoneOptions = useMemo(
		() =>
			TIMEZONES.map((tz) => ({
				value: tz.value,
				label: formatTimezoneLabel(tz),
				searchTerms: `${tz.label} ${tz.value} ${tz.offset}`,
			})),
		[],
	);

	const handleSubmit = () => {
		startTransition(async () => {
			const result = await updateCurrentUserProfile({
				displayName,
				avatarUrl,
				locale: preferredLocale,
				timezone,
			});

			if (!result.success) {
				let messageKey = "Form.messages.error";

				if (result.error === "invalid_avatar_url") {
					messageKey = "Form.messages.invalidAvatar";
				}

				if (result.error === "profile_not_found") {
					messageKey = "Form.messages.profileUnavailable";
				}

				toast({
					title: t("Form.messages.errorTitle"),
					description: t(messageKey),
					variant: "destructive",
				});
				return;
			}

			toast({
				title: t("Form.messages.successTitle"),
				description: t("Form.messages.successDescription"),
			});

			if (preferredLocale !== locale) {
				router.replace("/profile", { locale: preferredLocale });
				return;
			}

			router.refresh();
		});
	};

	return (
		<div className="bg-card rounded-lg border border-border p-6 space-y-6">
			<div className="space-y-1">
				<h2 className="text-xl font-semibold text-foreground">{t("Form.title")}</h2>
				<p className="text-sm text-muted-foreground">{t("Form.subtitle")}</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="profile-email">{t("Form.fields.email")}</Label>
					<Input id="profile-email" value={initialProfile.email || ""} disabled />
				</div>

				<div className="space-y-2">
					<Label htmlFor="profile-display-name">{t("Form.fields.displayName")}</Label>
					<Input
						id="profile-display-name"
						value={displayName}
						onChange={(event) => setDisplayName(event.target.value)}
						placeholder={t("Form.placeholders.displayName")}
					/>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="profile-avatar-url">{t("Form.fields.avatarUrl")}</Label>
					<Input
						id="profile-avatar-url"
						type="url"
						value={avatarUrl}
						onChange={(event) => setAvatarUrl(event.target.value)}
						placeholder={t("Form.placeholders.avatarUrl")}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="profile-locale">{t("Form.fields.locale")}</Label>
					<select
						id="profile-locale"
						value={preferredLocale}
						onChange={(event) => {
							const nextLocale = event.target.value;
							if (PROFILE_LOCALES.includes(nextLocale as (typeof PROFILE_LOCALES)[number])) {
								setPreferredLocale(nextLocale as (typeof PROFILE_LOCALES)[number]);
							}
						}}
						className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
					>
						<option value="en">{t("Form.locales.en")}</option>
						<option value="es">{t("Form.locales.es")}</option>
						<option value="pt">{t("Form.locales.pt")}</option>
						<option value="fr">{t("Form.locales.fr")}</option>
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="profile-timezone">{t("Form.fields.timezone")}</Label>
					<Autocomplete
						options={timezoneOptions}
						value={timezone}
						onChange={(value) => setTimezone(value || "UTC")}
						placeholder={t("Form.placeholders.selectTimezone")}
						searchPlaceholder={t("Form.placeholders.searchTimezone")}
						emptyMessage={t("Form.placeholders.noTimezoneFound")}
					/>
				</div>
			</div>

			<div className="flex justify-end">
				<Button type="button" onClick={handleSubmit} disabled={isPending}>
					{isPending ? t("Form.actions.saving") : t("Form.actions.save")}
				</Button>
			</div>
		</div>
	);
}
