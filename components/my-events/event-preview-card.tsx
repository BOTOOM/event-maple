"use client";

import { Calendar, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface EventPreviewCardProps {
	readonly name: string;
	readonly description: string;
	readonly startAt: string;
	readonly endAt: string;
	readonly timezone: string;
	readonly location: string;
	readonly imageUrl: string;
	readonly categoryName?: string;
	readonly locale: string;
}

export function EventPreviewCard({
	name,
	description,
	startAt,
	endAt,
	timezone,
	location,
	imageUrl,
	categoryName,
}: Readonly<EventPreviewCardProps>) {
	const t = useTranslations("MyEvents.Preview");

	const formatDateRange = () => {
		if (!startAt || !endAt) return t("noDate");

		try {
			const start = new Date(startAt);
			const end = new Date(endAt);

			const startDay = start.getDate();
			const endDay = end.getDate();
			const startMonth = start.toLocaleDateString("en-US", { month: "short" });
			const endMonth = end.toLocaleDateString("en-US", { month: "short" });
			const year = start.getFullYear();

			if (startMonth === endMonth) {
				return `${startDay} - ${endDay} ${startMonth}, ${year}`;
			}
			return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`;
		} catch {
			return t("noDate");
		}
	};

	const getTimezoneDisplay = () => {
		if (!timezone || timezone === "UTC") return "";

		const tzParts = timezone.split("/");
		const city = tzParts.at(-1)?.replaceAll("_", " ") ?? "";

		try {
			const offset = new Intl.DateTimeFormat("en-US", {
				timeZone: timezone,
				timeZoneName: "shortOffset",
			})
				.formatToParts(new Date())
				.find((part) => part.type === "timeZoneName")?.value;

			return `${city} (${offset})`;
		} catch {
			return city;
		}
	};

	return (
		<div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
			{/* Image */}
			<div className="relative w-full h-48 bg-gradient-to-br from-winter-700 to-winter-900">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={name || t("eventImage")}
						fill
						className="object-cover"
						onError={(e) => {
							e.currentTarget.style.display = "none";
						}}
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-white/30 text-sm">{t("noImage")}</span>
					</div>
				)}

				{/* Category Badge */}
				{categoryName && (
					<div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-winter-900/80 text-white text-xs font-medium">
						{categoryName}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-4 space-y-3">
				{/* Date */}
				<div className="flex items-center gap-2 text-sm text-primary">
					<Calendar className="h-4 w-4" />
					<span>{formatDateRange()}</span>
				</div>

				{/* Title */}
				<h3 className="text-xl font-bold text-foreground line-clamp-2">{name || t("untitled")}</h3>

				{/* Location */}
				{(location || timezone) && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="h-4 w-4 flex-shrink-0" />
						<span className="line-clamp-1">{location || getTimezoneDisplay()}</span>
					</div>
				)}

				{/* Description */}
				{description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}

				{/* Actions */}
				<div className="flex items-center gap-2 pt-2">
					<Button className="flex-1">{t("register")}</Button>
					<Button variant="outline" size="icon">
						<Share2 className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
