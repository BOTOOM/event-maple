import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventsHeader } from "@/components/events/events-header";
import { EventCard } from "@/components/events/event-card";
import { EmptyEvents } from "@/components/events/empty-events";
import { Event } from "@/lib/types/event";

export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch events
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

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Próximos Eventos
          </h1>
        </div>

        {!events || events.length === 0 ? (
          <EmptyEvents />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: Event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
