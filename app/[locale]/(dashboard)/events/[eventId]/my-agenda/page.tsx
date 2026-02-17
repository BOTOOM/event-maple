import { AlertCircle, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AgendaHeader } from "@/components/agenda/agenda-header";
import { MyAgendaClient } from "@/components/agenda/my-agenda-client";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { requireAuthenticatedUser } from "@/lib/supabase/server";
import { Talk } from "@/lib/types/talk";

interface MyAgendaPageProps {
	readonly params: Promise<{
		readonly eventId: string;
		readonly locale: string;
	}>;
	readonly searchParams: Promise<{
		readonly date?: string;
	}>;
}

export default async function MyAgendaPage({ params, searchParams }: MyAgendaPageProps) {
	const { supabase, user } = await requireAuthenticatedUser();

	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	const eventId = Number.parseInt(resolvedParams.eventId, 10);
	const t = await getTranslations({ locale: resolvedParams.locale, namespace: "Events.MyAgenda" });

	if (Number.isNaN(eventId)) {
		notFound();
	}

	// Fetch event details
	const { data: event, error: eventError } = await supabase
		.from("events")
		.select("*")
		.eq("id", eventId)
		.single();

	if (eventError || !event) {
		notFound();
	}

	// Fetch ALL talks for this event (to show available dates)
	const { data: allTalks, error: talksError } = await supabase
		.from("talks")
		.select("*")
		.eq("event_id", eventId)
		.order("date", { ascending: true })
		.order("start_time", { ascending: true });

	if (talksError) {
		console.error("Error fetching talks:", talksError);
	}

	// Get unique dates
	const uniqueDates = Array.from(new Set(allTalks?.map((talk) => talk.date) || [])).sort((a, b) =>
		a.localeCompare(b),
	);

	// Determine selected date (from query param or first available)
	const selectedDate = resolvedSearchParams.date || uniqueDates[0] || event.start_date;

	// Fetch user's personal agenda
	const { data: agendaItems } = await supabase
		.from("personal_agenda")
		.select("talk_id")
		.eq("user_id", user.id)
		.eq("event_id", eventId);

	const agendaTalkIds = new Set(agendaItems?.map((item) => item.talk_id) || []);

	// Filter talks for selected date
	const talksForDate = (allTalks || []).filter((talk) => talk.date === selectedDate);

	// Include:
	// 1. User's saved talks
	// 2. Fixed events (is_fixed = true)
	const myAgendaTalks = talksForDate.filter((talk) => agendaTalkIds.has(talk.id) || talk.is_fixed);

	// Add is_in_my_agenda flag
	const talksWithStatus: Array<Talk & { is_in_my_agenda: boolean }> = myAgendaTalks.map((talk) => ({
		...talk,
		is_in_my_agenda: agendaTalkIds.has(talk.id),
	}));

	const eventTitle = event.title || event.name;
	const hasNoTalks = talksWithStatus.length === 0;

	return (
		<div className="min-h-screen bg-surface">
			{/* Header */}
			<AgendaHeader eventId={eventId} eventTitle={eventTitle} />

			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
				{/* Empty State */}
				{hasNoTalks ? (
					<div className="text-center py-12 px-4 bg-card rounded-lg border border-border">
						<div className="w-16 h-16 bg-winter-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Calendar className="h-8 w-8 text-primary" />
						</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">{t("empty.title")}</h3>
						<p className="text-muted-foreground max-w-md mx-auto mb-6">{t("empty.description")}</p>
						<Link href={`/events/${eventId}/agenda`}>
							<Button>
								<Calendar className="h-4 w-4 mr-2" />
								{t("empty.action")}
							</Button>
						</Link>
					</div>
				) : (
					<>
						{/* Info Box - Conflicts Warning */}
						{talksWithStatus.length > 1 && (
							<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
								<div>
									<p className="text-sm font-medium text-amber-900 mb-1">{t("conflicts.title")}</p>
									<p className="text-sm text-amber-700">{t("conflicts.description")}</p>
								</div>
							</div>
						)}

						{/* Timeline View (Client Component) */}
						<MyAgendaClient
							talks={talksWithStatus}
							eventId={eventId}
							selectedDate={selectedDate}
							availableDates={uniqueDates}
						/>
					</>
				)}
			</main>
		</div>
	);
}
