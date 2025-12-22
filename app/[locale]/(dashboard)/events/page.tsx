import { EventsHeader } from "@/components/events/events-header";
import { EventsPageClient } from "@/components/events/events-page-client";
import { createClient } from "@/lib/supabase/server";

export default async function EventsPage() {
	const supabase = await createClient();

	// Fetch ALL events (filtering will be done client-side)
	const { data: events, error } = await supabase
		.from("events")
		.select("*")
		.order("start_date", { ascending: true });

	if (error) {
		console.error("Error fetching events:", error);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<EventsHeader />
			<EventsPageClient initialEvents={events || []} />
		</div>
	);
}
