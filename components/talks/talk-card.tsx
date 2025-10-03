import Link from "next/link";
import { Clock, MapPin, User } from "lucide-react";
import { Talk, formatTalkTime, formatTalkLocation } from "@/lib/types/talk";
import { AddToAgendaButton } from "@/components/talks/add-to-agenda-button";

interface TalkCardProps {
  talk: Talk;
  eventId: number;
  isInAgenda?: boolean;
}

export function TalkCard({ talk, eventId, isInAgenda = false }: TalkCardProps) {
  const timeRange = formatTalkTime(talk.start_time, talk.end_time);
  const location = formatTalkLocation(talk.room, talk.floor);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
          <Clock className="h-5 w-5 text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/events/${eventId}/talks/${talk.id}`}
            className="group"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {talk.title}
            </h3>
          </Link>

          {talk.short_description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {talk.short_description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs sm:text-sm text-gray-500">
            <span className="font-medium text-blue-600">{timeRange}</span>
            
            {location !== 'Ubicación por confirmar' && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{location}</span>
              </div>
            )}

            {talk.speaker_name && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{talk.speaker_name}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {talk.tags && talk.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {talk.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {talk.tags.length > 3 && (
                <span className="inline-block px-2 py-0.5 text-gray-500 text-xs">
                  +{talk.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <AddToAgendaButton
          talkId={talk.id}
          eventId={eventId}
          initialIsInAgenda={isInAgenda}
        />
      </div>
    </div>
  );
}
