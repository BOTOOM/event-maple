import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	DEFAULT_PROFILE_LOCALE,
	DEFAULT_PROFILE_TIMEZONE,
	PROFILE_LOCALES,
	type ProfileLocale,
	type UserProfile,
} from "@/lib/types/profile";

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
}

export async function requireAuthenticatedUser() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	return { supabase, user };
}

function normalizeProfileLocale(locale: string | null | undefined): ProfileLocale {
	if (locale && PROFILE_LOCALES.includes(locale as ProfileLocale)) {
		return locale as ProfileLocale;
	}

	return DEFAULT_PROFILE_LOCALE;
}

function isMissingTableError(error: unknown): boolean {
	if (!error || typeof error !== "object") {
		return false;
	}

	const code = "code" in error ? (error.code as string | undefined) : undefined;
	return code === "42P01";
}

function buildFallbackProfile(user: { id: string; email?: string | null }): UserProfile {
	return {
		id: user.id,
		email: user.email ?? null,
		display_name: null,
		avatar_url: null,
		locale: DEFAULT_PROFILE_LOCALE,
		timezone: DEFAULT_PROFILE_TIMEZONE,
		created_at: null,
		updated_at: null,
	};
}

export async function getCurrentUserProfile() {
	const { supabase, user } = await requireAuthenticatedUser();
	const fallbackProfile = buildFallbackProfile(user);

	const { data, error } = await supabase
		.from("user_profiles")
		.select("id, email, display_name, avatar_url, locale, timezone, created_at, updated_at")
		.eq("id", user.id)
		.maybeSingle();

	if (error) {
		if (isMissingTableError(error)) {
			return { supabase, user, profile: fallbackProfile };
		}

		console.error("Error fetching current user profile:", error);
		return { supabase, user, profile: fallbackProfile };
	}

	if (!data) {
		return { supabase, user, profile: fallbackProfile };
	}

	return {
		supabase,
		user,
		profile: {
			id: data.id,
			email: data.email ?? user.email ?? null,
			display_name: data.display_name,
			avatar_url: data.avatar_url,
			locale: normalizeProfileLocale(data.locale),
			timezone: data.timezone || DEFAULT_PROFILE_TIMEZONE,
			created_at: data.created_at,
			updated_at: data.updated_at,
		} satisfies UserProfile,
	};
}
