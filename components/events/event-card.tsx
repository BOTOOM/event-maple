"use client";

import { ArrowRight, Calendar, MapPin, Tag } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { Link } from "@/lib/i18n/navigation";
import { Event, getEventTitle } from "@/lib/types/event";
import { formatDateForDisplay } from "@/lib/utils/date";

interface EventCardProps {
	readonly event: Event;
}

export function EventCard({ event }: Readonly<EventCardProps>) {
	const t = useTranslations("Events.Card");
	const locale = useLocale();
	const eventTitle = getEventTitle(event);

	// Check if event has full timestamp (start_at) or just date (start_date)
	const hasFullTimestamp = event.start_at?.includes("T");

	// Format date in user's browser timezone
	// If we have full timestamp, show date and time; otherwise just date
	const formattedDate = hasFullTimestamp
		? formatDateForDisplay(event.start_at, locale, {
				day: "numeric",
				month: "long",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit",
			})
		: formatDateForDisplay(event.start_date, locale, {
				day: "numeric",
				month: "long",
				year: "numeric",
				hour: undefined,
				minute: undefined,
			});

	return (
		<div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
			{/* Image */}
			<div className="relative w-full h-48 bg-gradient-to-br from-winter-700 to-winter-900">
				{event.image_url ? (
					<Image src={event.image_url} alt={eventTitle} fill className="object-cover" />
				) : (
					<div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
						<span className="text-center px-4">
							{t("noImage")}
							<br />
							{eventTitle}
						</span>
					</div>
				)}
				{/* Share Button */}
				<div className="absolute top-2 right-2">
					<ShareButton
						url={`/events/${event.id}`}
						title={eventTitle}
						description={event.description ?? undefined}
						variant="outline"
						className="bg-white/90 hover:bg-white"
					/>
				</div>
			</div>

			{/* Content */}
			<div className="p-4 sm:p-5 space-y-3">
				{/* Category Badge */}
				{event.category_name && (
					<div className="flex items-center gap-1.5">
						<Tag className="h-3.5 w-3.5 text-primary" />
						<span className="text-xs font-medium text-primary bg-winter-100 px-2 py-0.5 rounded-full">
							{event.category_name}
						</span>
					</div>
				)}

				<h3 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-2">
					{eventTitle}
				</h3>

				<div className="space-y-2">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Calendar className="h-4 w-4 flex-shrink-0" />
						<span>{formattedDate}</span>
					</div>

					{event.location && (
						<div className="flex items-start gap-2 text-sm text-muted-foreground">
							<MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
							<span className="line-clamp-2">{event.location}</span>
						</div>
					)}
				</div>

				<Link href={`/events/${event.id}`} className="w-full">
					<Button className="inline-flex items-center justify-center gap-2 w-full mt-2" size="lg">
						{t("viewDetails")}
						<ArrowRight className="h-4 w-4" />
					</Button>
				</Link>
			</div>
		</div>
	);
}
