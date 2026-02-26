import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { EventsHeader } from "@/components/events/events-header";
import { EventFormClient } from "@/components/my-events/event-form-client";
import { MyEventsFormPageHeader } from "@/components/my-events/my-events-form-page-header";
import { getCategories, getEventById } from "@/lib/actions/events";
import { getTalkFieldSuggestions, getTalksByEventId } from "@/lib/actions/talks";
import { requireAuthenticatedUser } from "@/lib/supabase/server";
import { formatDateTimeForTimezone } from "@/lib/utils/date";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("MyEvents.Edit");

	return {
		title: t("pageTitle"),
		description: t("pageDescription"),
	};
}

interface EditEventPageProps {
	readonly params: Promise<{
		eventId: string;
	}>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
	await requireAuthenticatedUser();

	const { eventId } = await params;
	const locale = await getLocale();
	const t = await getTranslations("MyEvents.Edit");

	const eventIdNum = Number.parseInt(eventId, 10);
	if (Number.isNaN(eventIdNum)) {
		notFound();
	}

	const [event, categories] = await Promise.all([
		getEventById(eventIdNum, locale),
		getCategories(locale),
	]);

	if (!event?.is_owner) {
		notFound();
	}

	const [talks, talkSuggestions] = await Promise.all([
		getTalksByEventId(eventIdNum),
		getTalkFieldSuggestions(eventIdNum),
	]);

	// Convert UTC datetime from Supabase to the event's timezone for editing
	// This ensures the user sees the same time they originally entered
	const eventTimezone = event.timezone || "UTC";

	const initialData = {
		id: event.id,
		name: event.name,
		description: event.description || "",
		start_at: formatDateTimeForTimezone(event.start_at, eventTimezone),
		end_at: formatDateTimeForTimezone(event.end_at, eventTimezone),
		timezone: eventTimezone,
		country_code: event.country_code || "",
		location: event.location || "",
		image_url: event.image_url || "",
		category_id: event.category_id || "",
		status: event.status,
	};

	return (
		<div className="min-h-screen bg-surface">
			<EventsHeader />
			<div className="container mx-auto px-4 py-8">
				<MyEventsFormPageHeader
					myEventsLabel={t("breadcrumb.myEvents")}
					breadcrumbAction={t("breadcrumb.edit")}
					title={t("title")}
					subtitle={t("subtitle")}
				/>

				<EventFormClient
					categories={categories}
					locale={locale}
					mode="edit"
					initialData={initialData}
					talks={talks}
					talkSuggestions={talkSuggestions}
				/>
			</div>
		</div>
	);
}
