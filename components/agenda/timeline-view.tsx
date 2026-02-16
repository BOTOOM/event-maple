"use client";

import { TalkTimelineCard } from "@/components/agenda/talk-timeline-card";
import {
	calculateHeight,
	calculateTopPosition,
	generateTimeSlots,
	TalkWithConflict,
} from "@/lib/utils/timeline";

interface TimelineViewProps {
	talks: TalkWithConflict[];
	eventId: number;
	startHour?: number;
	endHour?: number;
	pixelsPerHour?: number;
}

export function TimelineView({
	talks,
	eventId,
	startHour = 7,
	endHour = 20,
	pixelsPerHour = 140,
}: Readonly<TimelineViewProps>) {
	const timeSlots = generateTimeSlots(startHour, endHour);
	const totalHeight = (endHour - startHour + 1) * pixelsPerHour;

	return (
		<div className="relative border border-border rounded-lg bg-card overflow-hidden">
			{/* Time labels (left side) */}
			<div className="absolute left-0 top-0 w-20 h-full border-r border-border bg-surface">
				{timeSlots.map((slot) => (
					<div
						key={slot.label}
						className="absolute left-0 w-full px-2 text-sm font-medium text-muted-foreground"
						style={{
							top: `${(slot.hour - startHour) * pixelsPerHour}px`,
							height: `${pixelsPerHour}px`,
						}}
					>
						{slot.label}
					</div>
				))}
			</div>

			{/* Timeline grid */}
			<div className="ml-20 relative" style={{ height: `${totalHeight}px` }}>
				{/* Hour lines */}
				{timeSlots.map((slot) => (
					<div
						key={slot.label}
						className="absolute left-0 right-0 border-t border-border"
						style={{ top: `${(slot.hour - startHour) * pixelsPerHour}px` }}
					/>
				))}

				{/* Talks */}
				<div className="absolute inset-0 px-2 py-1">
					{talks.map((talk) => {
						const top = calculateTopPosition(talk.start_time, startHour, pixelsPerHour);
						const height = calculateHeight(talk.start_time, talk.end_time, pixelsPerHour);

						// Calcular ancho y posición horizontal si hay conflictos
						const widthPercentage =
							talk.total_conflicts && talk.total_conflicts > 1
								? `${100 / talk.total_conflicts}%`
								: "100%";

						const leftPercentage =
							talk.conflict_column && talk.total_conflicts && talk.total_conflicts > 1
								? `${(talk.conflict_column / talk.total_conflicts) * 100}%`
								: "0%";

						return (
							<div
								key={talk.id}
								className="absolute"
								style={{
									top: `${top}px`,
									height: `${height}px`,
									left: leftPercentage,
									width: widthPercentage,
									padding: "0 4px",
								}}
							>
								<TalkTimelineCard
									talk={talk}
									eventId={eventId}
									isInAgenda={talk.is_in_my_agenda}
									hasConflict={talk.total_conflicts ? talk.total_conflicts > 1 : false}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
