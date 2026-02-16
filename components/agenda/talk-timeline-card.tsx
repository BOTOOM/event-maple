import { AlertCircle, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatTimeDisplay, getTalkColor, TalkWithConflict } from "@/lib/utils/timeline";

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
			href={talk.is_fixed ? "#" : `/events/${eventId}/talks/${talk.id}?from=my-agenda`}
			className={cn(
				"block h-full w-full rounded-lg border-2 p-3 hover:shadow-md transition-shadow overflow-hidden",
				colorClasses,
				talk.is_fixed && "cursor-default",
			)}
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-2 mb-2">
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium opacity-70 mb-1">
						{formatTimeDisplay(talk.start_time)}
					</p>
					<h3 className="text-base font-semibold leading-snug line-clamp-3">{talk.title}</h3>
				</div>
				{!talk.is_fixed && isInAgenda && (
					<Heart className="h-5 w-5 flex-shrink-0 fill-current text-red-500" />
				)}
				{hasConflict && <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600" />}
			</div>

			{/* Details */}
			{!talk.is_fixed && (
				<div className="space-y-1.5 text-sm">
					{talk.speaker_name && <p className="opacity-80 line-clamp-1">Por {talk.speaker_name}</p>}
					{talk.room && (
						<div className="flex items-center gap-1.5 opacity-70">
							<MapPin className="h-4 w-4 flex-shrink-0" />
							<span className="truncate">{talk.room}</span>
						</div>
					)}
				</div>
			)}

			{/* Fixed event indicator */}
			{talk.is_fixed && <p className="text-sm opacity-70 mt-2">Evento Fijo</p>}

			{/* Conflict warning */}
			{hasConflict && (
				<p className="text-sm font-medium text-orange-700 mt-2 flex items-center gap-1">
					<AlertCircle className="h-4 w-4" />
					Conflicto
				</p>
			)}
		</Link>
	);
}
