import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { EventsHeader } from "@/components/events/events-header";
import { EventFormClient } from "@/components/my-events/event-form-client";
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
		<div className="min-h-screen bg-gray-50">
			<EventsHeader />
			<div className="container mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="text-sm text-gray-500 mb-4">
					<span>{t("breadcrumb.myEvents")}</span>
					<span className="mx-2">›</span>
					<span className="text-gray-900">{t("breadcrumb.create")}</span>
				</nav>

				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
					<p className="text-gray-600 mt-1">{t("subtitle")}</p>
				</div>

				<EventFormClient categories={categories} locale={locale} mode="create" />
			</div>
		</div>
	);
}
