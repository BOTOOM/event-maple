export const PROFILE_LOCALES = ["en", "es", "pt", "fr"] as const;

export type ProfileLocale = (typeof PROFILE_LOCALES)[number];

export const DEFAULT_PROFILE_LOCALE: ProfileLocale = "en";
export const DEFAULT_PROFILE_TIMEZONE = "UTC";
export const DISPLAY_NAME_CHANGE_COOLDOWN_HOURS = 48;
export const DISPLAY_NAME_CHANGE_COOLDOWN_MS = DISPLAY_NAME_CHANGE_COOLDOWN_HOURS * 60 * 60 * 1000;

export interface DisplayNameChangeAvailability {
	canChangeDisplayName: boolean;
	nextDisplayNameChangeAt: string | null;
	remainingCooldownMs: number;
}

function parseProfileTimestamp(value: string | null | undefined): Date | null {
	if (!value) {
		return null;
	}

	const parsedDate = new Date(value);

	if (Number.isNaN(parsedDate.getTime())) {
		return null;
	}

	return parsedDate;
}

export function getDisplayNameChangeAvailability(
	lastDisplayNameUpdatedAt: string | null | undefined,
	now: Date = new Date(),
): DisplayNameChangeAvailability {
	const lastUpdatedAt = parseProfileTimestamp(lastDisplayNameUpdatedAt);

	if (!lastUpdatedAt) {
		return {
			canChangeDisplayName: true,
			nextDisplayNameChangeAt: null,
			remainingCooldownMs: 0,
		};
	}

	const nextDisplayNameChangeAtDate = new Date(
		lastUpdatedAt.getTime() + DISPLAY_NAME_CHANGE_COOLDOWN_MS,
	);
	const remainingCooldownMs = Math.max(0, nextDisplayNameChangeAtDate.getTime() - now.getTime());

	return {
		canChangeDisplayName: remainingCooldownMs === 0,
		nextDisplayNameChangeAt: nextDisplayNameChangeAtDate.toISOString(),
		remainingCooldownMs,
	};
}

export interface UserProfile {
	id: string;
	email: string | null;
	display_name: string | null;
	display_name_updated_at: string | null;
	avatar_url: string | null;
	locale: ProfileLocale;
	timezone: string;
	created_at: string | null;
	updated_at: string | null;
}
