"use server";

import { revalidatePath } from "next/cache";
import { TIMEZONES } from "@/lib/data/timezones";
import { getCurrentUserProfile, requireAuthenticatedUser } from "@/lib/supabase/server";
import {
	DEFAULT_PROFILE_LOCALE,
	DEFAULT_PROFILE_TIMEZONE,
	PROFILE_LOCALES,
	type ProfileLocale,
	type UserProfile,
} from "@/lib/types/profile";

const VALID_TIMEZONE_SET = new Set(TIMEZONES.map((timezone) => timezone.value));

function normalizeLocale(locale: string): ProfileLocale {
	if (PROFILE_LOCALES.includes(locale as ProfileLocale)) {
		return locale as ProfileLocale;
	}

	return DEFAULT_PROFILE_LOCALE;
}

function normalizeTimezone(timezone: string): string {
	if (VALID_TIMEZONE_SET.has(timezone)) {
		return timezone;
	}

	return DEFAULT_PROFILE_TIMEZONE;
}

function normalizeAvatarUrl(avatarUrl: string): { value: string | null; isValid: boolean } {
	const trimmedAvatar = avatarUrl.trim();

	if (!trimmedAvatar) {
		return { value: null, isValid: true };
	}

	try {
		const parsedUrl = new URL(trimmedAvatar);
		if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
			return { value: null, isValid: false };
		}

		return { value: parsedUrl.toString(), isValid: true };
	} catch {
		return { value: null, isValid: false };
	}
}

export interface UpdateProfileInput {
	displayName: string;
	avatarUrl: string;
	locale: string;
	timezone: string;
}

export interface UpdateProfileResult {
	success: boolean;
	error?: string;
	profile?: UserProfile;
}

export async function updateCurrentUserProfile(
	input: UpdateProfileInput,
): Promise<UpdateProfileResult> {
	const { supabase, user } = await requireAuthenticatedUser();

	const normalizedDisplayName = input.displayName.trim() || null;
	const normalizedLocale = normalizeLocale(input.locale);
	const normalizedTimezone = normalizeTimezone(input.timezone);
	const normalizedAvatar = normalizeAvatarUrl(input.avatarUrl);

	if (!normalizedAvatar.isValid) {
		return {
			success: false,
			error: "invalid_avatar_url",
		};
	}

	const { data: updatedProfile, error: updateError } = await supabase
		.from("user_profiles")
		.update({
			email: user.email ?? null,
			display_name: normalizedDisplayName,
			avatar_url: normalizedAvatar.value,
			locale: normalizedLocale,
			timezone: normalizedTimezone,
		})
		.eq("id", user.id)
		.select("id")
		.maybeSingle();

	if (updateError) {
		console.error("Error updating user profile:", updateError);
		return {
			success: false,
			error: "profile_update_failed",
		};
	}

	if (!updatedProfile) {
		return {
			success: false,
			error: "profile_not_found",
		};
	}

	const { profile } = await getCurrentUserProfile();

	revalidatePath("/[locale]/profile", "page");
	revalidatePath("/[locale]/events", "page");
	revalidatePath("/[locale]/my-events", "page");

	return {
		success: true,
		profile,
	};
}
