import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event, getEventTitle } from "@/lib/types/event";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventTitle = getEventTitle(event);
  // Usar parseISO para evitar conversión de timezone que cambia el día
  const formattedDate = format(parseISO(event.start_date), "d 'de' MMMM, yyyy", {
    locale: es,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-48 bg-gradient-to-br from-teal-500 to-teal-700">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={eventTitle}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
            <span className="text-center px-4">
              Sin imagen disponible
              <br />
              {eventTitle}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">
          {eventTitle}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>

          {event.location && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{event.location}</span>
            </div>
          )}
        </div>

        <Link
          href={`/events/${event.id}`}
          className="w-full"
        >
          <Button className="inline-flex items-center justify-center gap-2 w-full mt-2" size="lg">
            Ver detalles
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
