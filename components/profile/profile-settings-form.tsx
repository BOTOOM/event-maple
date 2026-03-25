"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateCurrentUserProfile } from "@/lib/actions/profile";
import { formatTimezoneLabel, TIMEZONES } from "@/lib/data/timezones";
import { useRouter } from "@/lib/i18n/navigation";
import {
	DISPLAY_NAME_CHANGE_COOLDOWN_HOURS,
	getDisplayNameChangeAvailability,
	PROFILE_LOCALES,
	type UserProfile,
} from "@/lib/types/profile";

function getCooldownLabel(remainingCooldownMs: number, t: ReturnType<typeof useTranslations>) {
	const totalMinutes = Math.max(1, Math.ceil(remainingCooldownMs / (60 * 1000)));
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	if (hours === 0) {
		return t("Form.displayName.cooldown.minutesOnly", { minutes });
	}

	if (minutes === 0) {
		return t("Form.displayName.cooldown.hoursOnly", { hours });
	}

	return t("Form.displayName.cooldown.hoursAndMinutes", { hours, minutes });
}

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
	const [displayNameUpdatedAt, setDisplayNameUpdatedAt] = useState(
		initialProfile.display_name_updated_at,
	);
	const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || "");
	const [preferredLocale, setPreferredLocale] = useState(initialProfile.locale);
	const [timezone, setTimezone] = useState(initialProfile.timezone);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

	useEffect(() => {
		setDisplayName(initialProfile.display_name || "");
		setDisplayNameUpdatedAt(initialProfile.display_name_updated_at);
		setAvatarUrl(initialProfile.avatar_url || "");
		setPreferredLocale(initialProfile.locale);
		setTimezone(initialProfile.timezone);
	}, [
		initialProfile.avatar_url,
		initialProfile.display_name,
		initialProfile.display_name_updated_at,
		initialProfile.locale,
		initialProfile.timezone,
	]);

	const timezoneOptions = useMemo(
		() =>
			TIMEZONES.map((tz) => ({
				value: tz.value,
				label: formatTimezoneLabel(tz),
				searchTerms: `${tz.label} ${tz.value} ${tz.offset}`,
			})),
		[],
	);
	const savedDisplayName = initialProfile.display_name || "";
	const hasDisplayNameChanged = displayName.trim() !== savedDisplayName.trim();
	const displayNameChangeAvailability = useMemo(
		() => getDisplayNameChangeAvailability(displayNameUpdatedAt),
		[displayNameUpdatedAt],
	);
	const displayNameCooldownLabel = useMemo(
		() => getCooldownLabel(displayNameChangeAvailability.remainingCooldownMs, t),
		[displayNameChangeAvailability.remainingCooldownMs, t],
	);
	const canChangeDisplayName = displayNameChangeAvailability.canChangeDisplayName;

	const submitProfileUpdate = (submittedDisplayNameChange: boolean) => {
		startTransition(async () => {
			const result = await updateCurrentUserProfile({
				displayName,
				avatarUrl,
				locale: preferredLocale,
				timezone,
			});

			if (!result.success) {
				let messageKey = "Form.messages.error";
				let messageValues: Record<string, number | string> | undefined;

				if (result.error === "invalid_avatar_url") {
					messageKey = "Form.messages.invalidAvatar";
				}

				if (result.error === "profile_not_found") {
					messageKey = "Form.messages.profileUnavailable";
				}

				if (result.error === "display_name_cooldown") {
					messageKey = "Form.messages.displayNameCooldown";
					messageValues = {
						time: getCooldownLabel(result.remainingCooldownMs ?? 0, t),
					};
					setIsConfirmDialogOpen(false);
					setDisplayName(result.profile?.display_name || "");
					setDisplayNameUpdatedAt(result.profile?.display_name_updated_at ?? null);
				}

				toast({
					title: t("Form.messages.errorTitle"),
					description: t(messageKey, messageValues),
					variant: "destructive",
				});
				return;
			}

			setIsConfirmDialogOpen(false);
			setDisplayName(result.profile?.display_name || "");
			setDisplayNameUpdatedAt(result.profile?.display_name_updated_at ?? null);
			setAvatarUrl(result.profile?.avatar_url || "");
			setPreferredLocale(result.profile?.locale || preferredLocale);
			setTimezone(result.profile?.timezone || timezone);

			toast({
				title: t("Form.messages.successTitle"),
				description: submittedDisplayNameChange && result.nextDisplayNameChangeAt
					? t("Form.messages.successDescriptionWithNameCooldown", {
							hours: DISPLAY_NAME_CHANGE_COOLDOWN_HOURS,
						})
					: t("Form.messages.successDescription"),
			});

			if (preferredLocale !== locale) {
				router.replace("/profile", { locale: preferredLocale });
				return;
			}

			router.refresh();
		});
	};

	const handleSubmit = () => {
		if (hasDisplayNameChanged && canChangeDisplayName) {
			setIsConfirmDialogOpen(true);
			return;
		}

		submitProfileUpdate(false);
	};

	return (
		<>
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
						<div className="flex flex-wrap items-center justify-between gap-2">
							<Label htmlFor="profile-display-name">{t("Form.fields.displayName")}</Label>
							<Badge
								variant={canChangeDisplayName ? "secondary" : "outline"}
								data-testid="profile-display-name-status-badge"
							>
								{canChangeDisplayName
									? t("Form.displayName.status.available")
									: t("Form.displayName.status.locked")}
							</Badge>
						</div>
						<Input
							id="profile-display-name"
							value={displayName}
							onChange={(event) => setDisplayName(event.target.value)}
							placeholder={t("Form.placeholders.displayName")}
							disabled={!canChangeDisplayName || isPending}
							aria-describedby="profile-display-name-status"
						/>
						<p
							id="profile-display-name-status"
							data-testid="profile-display-name-status-message"
							className="text-sm text-muted-foreground"
						>
							{canChangeDisplayName
								? t("Form.displayName.helper.available", {
										hours: DISPLAY_NAME_CHANGE_COOLDOWN_HOURS,
									})
								: t("Form.displayName.helper.locked", {
										time: displayNameCooldownLabel,
									})}
						</p>
					</div>

					<div className="space-y-2 md:col-span-2">
						<Label htmlFor="profile-avatar-url">{t("Form.fields.avatarUrl")}</Label>
						<Input
							id="profile-avatar-url"
							type="url"
							value={avatarUrl}
							onChange={(event) => setAvatarUrl(event.target.value)}
							placeholder={t("Form.placeholders.avatarUrl")}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="profile-locale">{t("Form.fields.locale")}</Label>
						<select
							id="profile-locale"
							value={preferredLocale}
							disabled={isPending}
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
							disabled={isPending}
						/>
					</div>
				</div>

				<div className="flex justify-end">
					<Button type="button" onClick={handleSubmit} disabled={isPending}>
						{isPending ? t("Form.actions.saving") : t("Form.actions.save")}
					</Button>
				</div>
			</div>

			<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
				<DialogContent data-testid="profile-display-name-confirmation-dialog">
					<DialogHeader>
						<DialogTitle>{t("Form.confirmDisplayName.title")}</DialogTitle>
						<DialogDescription>
							{t("Form.confirmDisplayName.description", {
									hours: DISPLAY_NAME_CHANGE_COOLDOWN_HOURS,
								})}
						</DialogDescription>
					</DialogHeader>

					<div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground">
						{t("Form.confirmDisplayName.notice", {
							hours: DISPLAY_NAME_CHANGE_COOLDOWN_HOURS,
						})}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsConfirmDialogOpen(false)}
							disabled={isPending}
							data-testid="profile-display-name-confirm-cancel"
						>
							{t("Form.confirmDisplayName.cancel")}
						</Button>
						<Button
							type="button"
							onClick={() => submitProfileUpdate(true)}
							disabled={isPending}
							data-testid="profile-display-name-confirm-submit"
						>
							{isPending ? t("Form.actions.saving") : t("Form.confirmDisplayName.confirm")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
