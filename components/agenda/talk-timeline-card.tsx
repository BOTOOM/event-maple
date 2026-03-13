import { AlertCircle, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { formatTimeDisplay, getTalkColor, TalkWithConflict } from "@/lib/utils/timeline";

interface TalkTimelineCardProps {
	talk: TalkWithConflict;
	eventId: number;
	isInAgenda: boolean;
	hasConflict: boolean;
	isCompact?: boolean;
}

export function TalkTimelineCard({
	talk,
	eventId,
	isInAgenda,
	hasConflict,
	isCompact = false,
}: TalkTimelineCardProps) {
	const t = useTranslations("Events.TalkTimelineCard");
	const colorClasses = getTalkColor(talk);

	return (
		<Link
			href={talk.is_fixed ? "#" : `/events/${eventId}/talks/${talk.id}?from=my-agenda`}
			title={talk.title}
			className={cn(
				"block h-full w-full rounded-lg border-2 hover:shadow-md transition-shadow overflow-hidden",
				isCompact ? "p-2.5" : "p-3",
				colorClasses,
				talk.is_fixed && "cursor-default",
			)}
		>
			{/* Header */}
			<div className={cn("flex items-start justify-between gap-2", isCompact ? "mb-1" : "mb-2")}>
				<div className="flex-1 min-w-0">
					<p
						className={cn("font-medium opacity-70", isCompact ? "text-xs mb-0.5" : "text-sm mb-1")}
					>
						{formatTimeDisplay(talk.start_time)}
					</p>
					<h3
						className={cn(
							"font-semibold leading-snug",
							isCompact ? "text-sm line-clamp-2" : "text-base line-clamp-3",
						)}
					>
						{talk.title}
					</h3>
				</div>
				{!talk.is_fixed && isInAgenda && (
					<Heart
						className={cn(
							"flex-shrink-0 fill-current text-red-500",
							isCompact ? "h-4 w-4" : "h-5 w-5",
						)}
					/>
				)}
				{hasConflict && (
					<AlertCircle
						className={cn("flex-shrink-0 text-orange-600", isCompact ? "h-4 w-4" : "h-5 w-5")}
					/>
				)}
			</div>

			{/* Details */}
			{!talk.is_fixed && !isCompact && (
				<div className="space-y-1.5 text-sm">
					{talk.speaker_name && (
						<p className="opacity-80 line-clamp-1">{t("by", { speaker: talk.speaker_name })}</p>
					)}
					{talk.room && (
						<div className="flex items-center gap-1.5 opacity-70">
							<MapPin className="h-4 w-4 flex-shrink-0" />
							<span className="truncate">{talk.room}</span>
						</div>
					)}
				</div>
			)}

			{/* Fixed event indicator */}
			{talk.is_fixed && <p className="text-sm opacity-70 mt-2">{t("fixedEvent")}</p>}

			{/* Conflict warning */}
			{hasConflict && !isCompact && (
				<p className="text-sm font-medium text-orange-700 mt-2 flex items-center gap-1">
					<AlertCircle className="h-4 w-4" />
					{t("conflict")}
				</p>
			)}
		</Link>
	);
}
