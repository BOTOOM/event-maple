"use client";

import { useLocale } from "next-intl";
import { formatDateForDisplay } from "@/lib/utils/date";

interface EventDateDisplayProps {
	readonly startAt: string | null;
	readonly startDate: string;
	readonly showTime?: boolean;
}

/**
 * Client component to display event date with browser timezone conversion
 * If startAt has full timestamp, shows date and time converted to user's browser timezone
 * If only startDate exists, shows just the date without time
 */
export function EventDateDisplay({
	startAt,
	startDate,
	showTime = true,
}: Readonly<EventDateDisplayProps>) {
	const locale = useLocale();

	// Check if event has full timestamp (start_at with time component)
	const hasFullTimestamp = startAt?.includes("T");

	if (hasFullTimestamp && showTime) {
		// Show date and time converted to browser timezone
		return (
			<span>
				{formatDateForDisplay(startAt, locale, {
					day: "numeric",
					month: "long",
					year: "numeric",
					hour: "numeric",
					minute: "2-digit",
				})}
			</span>
		);
	}

	// Show just date (backward compatibility for events without full timestamp)
	return (
		<span>
			{formatDateForDisplay(startAt || startDate, locale, {
				day: "numeric",
				month: "long",
				year: "numeric",
				hour: undefined,
				minute: undefined,
			})}
		</span>
	);
}
