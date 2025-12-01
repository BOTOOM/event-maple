import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import { Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MyAgendaClient } from "@/components/agenda/my-agenda-client";
import { AgendaHeader } from "@/components/agenda/agenda-header";
import { Talk } from "@/lib/types/talk";
import { getTranslations } from "next-intl/server";

interface MyAgendaPageProps {
  params: Promise<{
    eventId: string;
    locale: string;
  }>;
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function MyAgendaPage({ params, searchParams }: MyAgendaPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const eventId = parseInt(resolvedParams.eventId, 10);
  const t = await getTranslations({locale: resolvedParams.locale, namespace: 'Events.MyAgenda'});

  if (isNaN(eventId)) {
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
  const uniqueDates = Array.from(
    new Set(allTalks?.map((talk) => talk.date) || [])
  ).sort();

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
  const myAgendaTalks = talksForDate.filter(
    (talk) => agendaTalkIds.has(talk.id) || talk.is_fixed
  );

  // Add is_in_my_agenda flag
  const talksWithStatus: Array<Talk & { is_in_my_agenda: boolean }> = myAgendaTalks.map(
    (talk) => ({
      ...talk,
      is_in_my_agenda: agendaTalkIds.has(talk.id),
    })
  );

  const eventTitle = event.title || event.name;
  const hasNoTalks = talksWithStatus.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AgendaHeader eventId={eventId} eventTitle={eventTitle} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">

        {/* Empty State */}
        {hasNoTalks ? (
          <div className="text-center py-12 px-4 bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("empty.title")}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {t("empty.description")}
            </p>
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
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-1">
                    {t("conflicts.title")}
                  </p>
                  <p className="text-sm text-orange-700">
                    {t("conflicts.description")}
                  </p>
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
