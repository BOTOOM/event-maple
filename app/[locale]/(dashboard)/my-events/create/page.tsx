import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { EventsHeader } from "@/components/events/events-header";
import { EventFormClient } from "@/components/my-events/event-form-client";
import { MyEventsFormPageHeader } from "@/components/my-events/my-events-form-page-header";
import { getCategories } from "@/lib/actions/events";
import { requireAuthenticatedUser } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("MyEvents.Create");

	return {
		title: t("pageTitle"),
		description: t("pageDescription"),
	};
}

export default async function CreateEventPage() {
	await requireAuthenticatedUser();

	const locale = await getLocale();
	const t = await getTranslations("MyEvents.Create");
	const categories = await getCategories(locale);

	return (
		<div className="min-h-screen bg-surface">
			<EventsHeader />
			<div className="container mx-auto px-4 py-8">
				<MyEventsFormPageHeader
					myEventsLabel={t("breadcrumb.myEvents")}
					breadcrumbAction={t("breadcrumb.create")}
					title={t("title")}
					subtitle={t("subtitle")}
				/>

				<EventFormClient categories={categories} locale={locale} mode="create" />
			</div>
		</div>
	);
}
