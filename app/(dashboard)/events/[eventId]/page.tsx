import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Users, ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/events/favorite-button";
import { getEventTitle } from "@/lib/types/event";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EventDetailPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Convertir eventId de string a number (bigint)
  const resolvedParams = await params;
  const eventId = parseInt(resolvedParams.eventId, 10);
  
  if (isNaN(eventId)) {
    notFound();
  }

  // Fetch event details
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error || !event) {
    notFound();
  }

  // Check if event is favorite - usando tu tabla users_events
  const { data: favoriteData } = await supabase
    .from("users_events")
    .select("*")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .eq("favorite", true)
    .single();

  const isFavorite = !!favoriteData;

  // Usar start_date de tu schema
  const formattedDate = format(new Date(event.start_date), "d 'de' MMMM, yyyy", {
    locale: es,
  });

  // Tu schema no tiene start_time/end_time en events, son date completos
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const timeRange = `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`;

  const eventTitle = getEventTitle(event);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="font-semibold text-gray-900">Detalles del Evento</span>
          <FavoriteButton eventId={eventId} initialIsFavorite={isFavorite} />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/events">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Eventos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-0 md:px-4 lg:px-8 pb-8">
        {/* Hero Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 md:rounded-lg md:mt-6 overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={eventTitle}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-6">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg opacity-75">{eventTitle}</p>
              </div>
            </div>
          )}

          {/* Desktop: Favorite Button Overlay */}
          <div className="hidden md:block absolute top-4 right-4">
            <div className="bg-white rounded-full shadow-lg">
              <FavoriteButton
                eventId={eventId}
                initialIsFavorite={isFavorite}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white md:rounded-lg md:shadow-sm mt-0 md:mt-6 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {eventTitle}
          </h1>

          {/* Event Meta */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha y hora</p>
                <p className="text-base font-medium text-gray-900">
                  {formattedDate} | {timeRange}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="text-base font-medium text-gray-900">
                    {event.location}
                  </p>
                </div>
              </div>
            )}

            {event.organizer && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organizado por</p>
                  <p className="text-base font-medium text-gray-900">
                    {event.organizer}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Add to Favorites */}
          <div className="hidden md:block mb-8">
            <FavoriteButton
              eventId={eventId}
              initialIsFavorite={isFavorite}
              variant="button"
            />
          </div>

          {/* Description */}
          {event.description && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Acerca del evento
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Agenda Section */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Agenda del Evento
            </h2>
            <p className="text-gray-600 mb-6">
              Explora las charlas, talleres y actividades programadas para este evento.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href={`/events/${eventId}/agenda`}>
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Ver Agenda Completa
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={`/events/${eventId}/my-agenda`}>
                  <Calendar className="h-5 w-5 mr-2" />
                  Mi Agenda Personal
                </Link>
              </Button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Button size="lg" className="w-full sm:w-auto">
              Registrarse Ahora
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
