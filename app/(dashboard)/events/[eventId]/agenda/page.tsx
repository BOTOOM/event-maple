import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TalkCard } from "@/components/talks/talk-card";
import { EmptyTalks } from "@/components/talks/empty-talks";
import { Talk } from "@/lib/types/talk";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

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

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const eventId = parseInt(resolvedParams.eventId, 10);

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

  // Fetch user's personal agenda
  const { data: agendaItems } = await supabase
    .from("personal_agenda")
    .select("talk_id")
    .eq("user_id", user.id)
    .eq("event_id", eventId);

  const agendaTalkIds = new Set(agendaItems?.map((item) => item.talk_id) || []);

  // Group talks by date
  const talksByDate = new Map<string, Talk[]>();
  talks?.forEach((talk) => {
    const dateKey = talk.date;
    if (!talksByDate.has(dateKey)) {
      talksByDate.set(dateKey, []);
    }
    talksByDate.get(dateKey)!.push(talk);
  });

  // Format date headers
  const formatDateHeader = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      const dayOfWeek = format(date, "EEEE", { locale: es });
      const dayMonth = format(date, "d 'de' MMMM", { locale: es });
      return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} - ${dayMonth}`;
    } catch {
      return dateStr;
    }
  };

  // Get time range for a group of talks
  const getTimeRange = (talks: Talk[]) => {
    if (talks.length === 0) return "";
    const startTimes = talks.map((t) => t.start_time).sort();
    const endTimes = talks.map((t) => t.end_time).sort();
    const formatTime = (time: string) => time.substring(0, 5);
    return `${formatTime(startTimes[0])} - ${formatTime(endTimes[endTimes.length - 1])}`;
  };

  const eventTitle = event.title || event.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <Link href={`/events/${eventId}`}>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Agenda del Evento
              </h1>
            </div>

            {/* Search Icon - Desktop */}
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Event Title */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Evento</p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {eventTitle}
          </h2>
        </div>

        {/* Search Bar - Mobile */}
        <div className="sm:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o ponente"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Talks List */}
        {!talks || talks.length === 0 ? (
          <EmptyTalks />
        ) : (
          <div className="space-y-8">
            {Array.from(talksByDate.entries()).map(([date, dateTalks]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatDateHeader(date)}
                  </h3>
                  <p className="text-sm text-gray-500">{getTimeRange(dateTalks)}</p>
                </div>

                {/* Talks for this date */}
                <div className="space-y-3">
                  {dateTalks.map((talk) => (
                    <TalkCard
                      key={talk.id}
                      talk={talk}
                      eventId={eventId}
                      isInAgenda={agendaTalkIds.has(talk.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
