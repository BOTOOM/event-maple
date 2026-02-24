export const PROFILE_LOCALES = ["en", "es", "pt", "fr"] as const;

export type ProfileLocale = (typeof PROFILE_LOCALES)[number];

export const DEFAULT_PROFILE_LOCALE: ProfileLocale = "en";
export const DEFAULT_PROFILE_TIMEZONE = "UTC";

export interface UserProfile {
	id: string;
	email: string | null;
	display_name: string | null;
	avatar_url: string | null;
	locale: ProfileLocale;
	timezone: string;
	created_at: string | null;
	updated_at: string | null;
}
