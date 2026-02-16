import { getLocale } from "next-intl/server";
import { EventsHeader } from "@/components/events/events-header";
import { EventsPageClient } from "@/components/events/events-page-client";
import { createClient } from "@/lib/supabase/server";

export default async function EventsPage() {
	const supabase = await createClient();
	const locale = await getLocale();

	// Fetch ONLY published events with category translations
	// Draft events are never shown in the public events list
	const { data: events, error } = await supabase
		.from("events")
		.select(
			`
			*,
			event_categories (
				id,
				slug,
				event_category_translations!inner (
					name
				)
			)
		`,
		)
		.eq("status", "published")
		.eq("event_categories.event_category_translations.locale", locale)
		.order("start_date", { ascending: true });

	if (error) {
		console.error("Error fetching events:", error);
	}

	// Map events to include category_name for display
	const mappedEvents = (events || []).map((event) => ({
		...event,
		category_name: event.event_categories?.event_category_translations?.[0]?.name || null,
	}));

	return (
		<div className="min-h-screen bg-gray-50">
			<EventsHeader />
			<EventsPageClient initialEvents={mappedEvents} />
		</div>
	);
}
