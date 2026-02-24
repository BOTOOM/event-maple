import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EventsHeader } from "@/components/events/events-header";
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import { getCurrentUserProfile } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Profile.Metadata");

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function ProfilePage() {
	const [t, profileContext] = await Promise.all([
		getTranslations("Profile"),
		getCurrentUserProfile(),
	]);

	return (
		<div className="min-h-screen bg-surface">
			<EventsHeader />
			<main className="container mx-auto px-4 py-8 space-y-6">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold text-foreground">{t("pageTitle")}</h1>
					<p className="text-muted-foreground">{t("pageDescription")}</p>
				</div>

				<ProfileSettingsForm initialProfile={profileContext.profile} />
			</main>
		</div>
	);
}
