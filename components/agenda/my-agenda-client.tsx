"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Talk } from "@/lib/types/talk";
import { convertTalkScheduleToBrowser } from "@/lib/utils/date";
import { detectConflicts, getTalkColor, TalkWithConflict } from "@/lib/utils/timeline";
import { DateSelector } from "./date-selector";
import { TimelineView } from "./timeline-view";

interface MyAgendaClientProps {
	readonly talks: Array<Talk & { is_in_my_agenda: boolean }>;
	readonly eventId: number;
	readonly eventTimezone: string;
	readonly initialDate?: string;
}

interface RoomLegend {
	room: string;
	colorClasses: string;
	count: number;
}

export function MyAgendaClient({
	talks,
	eventId,
	eventTimezone,
	initialDate,
}: Readonly<MyAgendaClientProps>) {
	const router = useRouter();
	const [isMobile, setIsMobile] = useState(false);
	const t = useTranslations("Events.MyAgenda");

	const localizedTalks = useMemo<Array<Talk & { is_in_my_agenda: boolean }>>(
		() =>
			talks.map((talk) => {
				const localizedSchedule = convertTalkScheduleToBrowser(
					talk.date,
					talk.start_time,
					talk.end_time,
					eventTimezone || "UTC",
				);

				return {
					...talk,
					date: localizedSchedule.date,
					start_time: localizedSchedule.startTime,
					end_time: localizedSchedule.endTime,
				};
			}),
		[talks, eventTimezone],
	);

	const availableDates = useMemo(
		() =>
			Array.from(new Set(localizedTalks.map((talk) => talk.date))).sort((a, b) =>
				a.localeCompare(b),
			),
		[localizedTalks],
	);

	const [currentDate, setCurrentDate] = useState(() => {
		if (initialDate && availableDates.includes(initialDate)) {
			return initialDate;
		}
		return availableDates[0] || initialDate || "";
	});

	useEffect(() => {
		const nextDate =
			(initialDate && availableDates.includes(initialDate) && initialDate) ||
			(availableDates.includes(currentDate) ? currentDate : availableDates[0]) ||
			initialDate ||
			"";

		if (nextDate !== currentDate) {
			setCurrentDate(nextDate);
		}
	}, [availableDates, currentDate, initialDate]);

	// Detect mobile on mount and window resize
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 640); // sm breakpoint
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleDateChange = (newDate: string) => {
		setCurrentDate(newDate);
		// Update URL with new date
		router.push(`/events/${eventId}/my-agenda?date=${newDate}`);
	};

	const talksForCurrentDate = useMemo(
		() => localizedTalks.filter((talk) => talk.date === currentDate),
		[localizedTalks, currentDate],
	);

	// Detect conflicts
	const talksWithConflicts: TalkWithConflict[] = detectConflicts(talksForCurrentDate);

	// Generate dynamic legend based on rooms in talks
	const roomLegends: RoomLegend[] = [];
	const roomMap = new Map<string, { colorClasses: string; count: number }>();

	// Count talks per room and get colors
	talksForCurrentDate.forEach((talk) => {
		const room = talk.room || "Sin sala";
		const colorClasses = getTalkColor(talk);

		if (roomMap.has(room)) {
			roomMap.get(room)!.count++;
		} else {
			roomMap.set(room, { colorClasses, count: 1 });
		}
	});

	// Convert to array and sort by count (most talks first)
	roomMap.forEach((data, room) => {
		roomLegends.push({
			room,
			colorClasses: data.colorClasses,
			count: data.count,
		});
	});

	roomLegends.sort((a, b) => b.count - a.count);

	// Adjust pixels per hour based on screen size
	const pixelsPerHour = isMobile ? 180 : 140;

	return (
		<div className="space-y-6">
			{/* Date Selector */}
			{availableDates.length > 1 && (
				<DateSelector
					selectedDate={currentDate}
					availableDates={availableDates}
					onDateChange={handleDateChange}
				/>
			)}

			{/* Timeline */}
			<div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
				<h3 className="text-lg font-semibold text-foreground mb-4">{t("timeline.title")}</h3>
				<div className="overflow-x-auto">
					<div className="min-w-[600px]">
						<TimelineView
							talks={talksWithConflicts}
							eventId={eventId}
							startHour={7}
							endHour={20}
							pixelsPerHour={pixelsPerHour}
							minTalkHeight={isMobile ? 64 : 52}
						/>
					</div>
				</div>
			</div>

			{/* Dynamic Legend */}
			{roomLegends.length > 0 && (
				<div className="bg-card rounded-lg border border-border p-4">
					<h4 className="text-sm font-semibold text-foreground mb-3">{t("legend.rooms")}</h4>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
						{roomLegends.map((legend) => {
							// Extract background color from colorClasses
							const bgColorMatch = /bg-(\w+)-(\d+)/.exec(legend.colorClasses);
							const borderColorMatch = /border-(\w+)-(\d+)/.exec(legend.colorClasses);

							const bgColor = bgColorMatch
								? `bg-${bgColorMatch[1]}-${bgColorMatch[2]}`
								: "bg-gray-100";
							const borderColor = borderColorMatch
								? `border-${borderColorMatch[1]}-${borderColorMatch[2]}`
								: "border-gray-300";

							return (
								<div key={legend.room} className="flex items-center gap-2">
									<div
										className={`w-4 h-4 rounded ${bgColor} border-2 ${borderColor} flex-shrink-0`}
									></div>
									<span className="text-foreground truncate">
										{legend.room} {legend.count > 1 && `(${legend.count})`}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
