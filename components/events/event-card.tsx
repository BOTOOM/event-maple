import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { Event, getEventTitle } from "@/lib/types/event";

interface EventCardProps {
	event: Event;
}

export function EventCard({ event }: EventCardProps) {
	const t = useTranslations("Events.Card");
	const format = useFormatter();
	const eventTitle = getEventTitle(event);

	// Usar next-intl formatter
	const formattedDate = format.dateTime(new Date(event.start_date), {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
			{/* Image */}
			<div className="relative w-full h-48 bg-gradient-to-br from-teal-500 to-teal-700">
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
