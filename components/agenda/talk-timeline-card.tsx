import Link from "next/link";
import { Heart, MapPin, AlertCircle } from "lucide-react";
import { TalkWithConflict, getTalkColor, formatTimeDisplay } from "@/lib/utils/timeline";
import { cn } from "@/lib/utils";

interface TalkTimelineCardProps {
  talk: TalkWithConflict;
  eventId: number;
  isInAgenda: boolean;
  hasConflict: boolean;
}

export function TalkTimelineCard({
  talk,
  eventId,
  isInAgenda,
  hasConflict,
}: TalkTimelineCardProps) {
  const colorClasses = getTalkColor(talk);

  return (
    <Link
      href={talk.is_fixed ? "#" : `/events/${eventId}/talks/${talk.id}`}
      className={cn(
        "block h-full w-full rounded-lg border-2 p-2 hover:shadow-md transition-shadow overflow-hidden",
        colorClasses,
        talk.is_fixed && "cursor-default"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-1 mb-1">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium opacity-70">
            {formatTimeDisplay(talk.start_time)}
          </p>
          <h3 className="text-sm font-semibold leading-tight line-clamp-2 mt-0.5">
            {talk.title}
          </h3>
        </div>
        {!talk.is_fixed && isInAgenda && (
          <Heart className="h-4 w-4 flex-shrink-0 fill-current text-red-500" />
        )}
        {hasConflict && (
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-orange-600" />
        )}
      </div>

      {/* Details */}
      {!talk.is_fixed && (
        <div className="space-y-1 text-xs">
          {talk.speaker_name && (
            <p className="truncate opacity-80">
              Por {talk.speaker_name}
            </p>
          )}
          {talk.room && (
            <div className="flex items-center gap-1 opacity-70">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{talk.room}</span>
            </div>
          )}
        </div>
      )}

      {/* Fixed event indicator */}
      {talk.is_fixed && (
        <p className="text-xs opacity-70 mt-1">Evento Fijo</p>
      )}

      {/* Conflict warning */}
      {hasConflict && (
        <p className="text-xs font-medium text-orange-700 mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Conflicto de horario
        </p>
      )}
    </Link>
  );
}
