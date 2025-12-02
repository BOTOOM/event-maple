import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AgendaHeader } from "@/components/agenda/agenda-header";
import { AgendaPageClient } from "@/components/agenda/agenda-page-client";

interface AgendaPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function AgendaPage({ params }: AgendaPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedParams = await params;
  const eventId = Number.parseInt(resolvedParams.eventId, 10);

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

  // Fetch talks for this event
  const { data: talks, error: talksError } = await supabase
    .from("talks")
    .select("*")
    .eq("event_id", eventId)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (talksError) {
    console.error("Error fetching talks:", talksError);
  }

  // Fetch user's personal agenda only if logged in
  let agendaTalkIds = new Set<number>();
  
  if (user) {
    const { data: agendaItems } = await supabase
      .from("personal_agenda")
      .select("talk_id")
      .eq("user_id", user.id)
      .eq("event_id", eventId);
      
    agendaTalkIds = new Set(agendaItems?.map((item) => item.talk_id) || []);
  }

  const eventTitle = event.title || event.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AgendaHeader eventId={eventId} eventTitle={eventTitle} />
      
      {/* Client-side component for filtering and searching */}
      <AgendaPageClient
        talks={talks || []}
        eventId={eventId}
        agendaTalkIds={agendaTalkIds}
      />
    </div>
  );
}
