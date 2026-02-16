/**
 * Utility functions for date and timezone handling
 *
 * Strategy:
 * - Dates are stored in Supabase as UTC (timestamptz)
 * - When user creates/edits an event, they input time in the selected timezone
 * - We convert that local time to UTC before saving
 * - When displaying in cards (Events, MyEvents), we convert UTC to user's browser timezone
 * - When editing, we convert UTC back to the event's stored timezone
 */

/**
 * Gets the browser's current timezone IANA ID
 */
export function getBrowserTimezone(): string {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	} catch {
		return "UTC";
	}
}

/**
 * Formats a UTC date to a specific timezone for datetime-local input (YYYY-MM-DDTHH:mm)
 * Used when loading event data for editing - converts UTC to event's timezone
 */
export function formatDateTimeForTimezone(utcDateStr: string | null, timeZone: string): string {
	if (!utcDateStr) return "";

	try {
		const date = new Date(utcDateStr);
		if (Number.isNaN(date.getTime())) return "";

		const formatter = new Intl.DateTimeFormat("en-CA", {
			timeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});

		const parts = formatter.formatToParts(date);
		const map = new Map(parts.map((p) => [p.type, p.value]));

		const year = map.get("year");
		const month = map.get("month");
		const day = map.get("day");
		let hour = map.get("hour");
		// Handle midnight edge case
		if (hour === "24") hour = "00";
		const minute = map.get("minute");

		return `${year}-${month}-${day}T${hour}:${minute}`;
	} catch {
		return "";
	}
}

/**
 * Converts a datetime-local value (YYYY-MM-DDTHH:mm) from a specific timezone to UTC ISO string
 * Used when saving event data - converts from event's timezone to UTC
 */
export function convertLocalToUTC(localDateTime: string, timeZone: string): string {
	if (!localDateTime) return "";

	try {
		const [datePart, timePart] = localDateTime.split("T");
		if (!datePart || !timePart) return "";

		const [year, month, day] = datePart.split("-").map(Number);
		const [hour, minute] = timePart.split(":").map(Number);

		// Create a formatter for the target timezone
		const formatter = new Intl.DateTimeFormat("en-US", {
			timeZone,
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: false,
		});

		// We need to find the UTC timestamp that, when formatted in the target timezone,
		// gives us the exact date/time the user entered
		// Start with an approximate UTC time
		const approxDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

		// Binary search to find the exact UTC timestamp
		let low = approxDate.getTime() - 24 * 60 * 60 * 1000;
		let high = approxDate.getTime() + 24 * 60 * 60 * 1000;

		for (let i = 0; i < 40; i++) {
			const mid = Math.floor((low + high) / 2);
			const midDate = new Date(mid);

			const parts = formatter.formatToParts(midDate);
			const map = new Map(parts.map((p) => [p.type, p.value]));

			const fYear = Number(map.get("year"));
			const fMonth = Number(map.get("month"));
			const fDay = Number(map.get("day"));
			let fHour = Number(map.get("hour"));
			if (fHour === 24) fHour = 0;
			const fMinute = Number(map.get("minute"));

			// Compare as total minutes from epoch for simplicity
			const targetTotal = year * 525960 + month * 43830 + day * 1440 + hour * 60 + minute;
			const midTotal = fYear * 525960 + fMonth * 43830 + fDay * 1440 + fHour * 60 + fMinute;

			if (midTotal < targetTotal) {
				low = mid;
			} else if (midTotal > targetTotal) {
				high = mid;
			} else {
				return midDate.toISOString();
			}
		}

		return new Date(Math.floor((low + high) / 2)).toISOString();
	} catch {
		return "";
	}
}

/**
 * Formats a UTC date string for display in the user's browser timezone
 * Used in event cards and listings
 */
export function formatDateForDisplay(
	utcDateStr: string | null,
	locale: string = "en",
	options?: Intl.DateTimeFormatOptions,
): string {
	if (!utcDateStr) return "";

	try {
		const date = new Date(utcDateStr);
		if (Number.isNaN(date.getTime())) return "";

		const browserTz = getBrowserTimezone();

		const defaultOptions: Intl.DateTimeFormatOptions = {
			timeZone: browserTz,
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
			...options,
		};

		return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
	} catch {
		return "";
	}
}

/**
 * Formats a date range for display (e.g., "Dec 3 - 5, 2025")
 */
export function formatDateRangeForDisplay(
	startUtc: string | null,
	endUtc: string | null,
	locale: string = "en",
): string {
	if (!startUtc) return "";

	try {
		const startDate = new Date(startUtc);
		if (Number.isNaN(startDate.getTime())) return "";

		const browserTz = getBrowserTimezone();

		const startFormatter = new Intl.DateTimeFormat(locale, {
			timeZone: browserTz,
			month: "short",
			day: "numeric",
		});

		if (!endUtc) {
			const yearFormatter = new Intl.DateTimeFormat(locale, {
				timeZone: browserTz,
				year: "numeric",
			});
			return `${startFormatter.format(startDate)}, ${yearFormatter.format(startDate)}`;
		}

		const endDate = new Date(endUtc);
		if (Number.isNaN(endDate.getTime())) {
			const yearFormatter = new Intl.DateTimeFormat(locale, {
				timeZone: browserTz,
				year: "numeric",
			});
			return `${startFormatter.format(startDate)}, ${yearFormatter.format(startDate)}`;
		}

		// Check if same day
		const sameDay =
			startDate.toLocaleDateString(locale, { timeZone: browserTz }) ===
			endDate.toLocaleDateString(locale, { timeZone: browserTz });

		if (sameDay) {
			const fullFormatter = new Intl.DateTimeFormat(locale, {
				timeZone: browserTz,
				month: "short",
				day: "numeric",
				year: "numeric",
			});
			return fullFormatter.format(startDate);
		}

		// Check if same month and year
		const startParts = new Intl.DateTimeFormat(locale, {
			timeZone: browserTz,
			month: "short",
			year: "numeric",
		}).formatToParts(startDate);
		const endParts = new Intl.DateTimeFormat(locale, {
			timeZone: browserTz,
			month: "short",
			year: "numeric",
		}).formatToParts(endDate);

		const startMonth = startParts.find((p) => p.type === "month")?.value;
		const endMonth = endParts.find((p) => p.type === "month")?.value;
		const startYear = startParts.find((p) => p.type === "year")?.value;
		const endYear = endParts.find((p) => p.type === "year")?.value;

		const startDay = new Intl.DateTimeFormat(locale, {
			timeZone: browserTz,
			day: "numeric",
		}).format(startDate);
		const endDay = new Intl.DateTimeFormat(locale, {
			timeZone: browserTz,
			day: "numeric",
		}).format(endDate);

		if (startMonth === endMonth && startYear === endYear) {
			return `${startMonth} ${startDay} - ${endDay}, ${startYear}`;
		}

		if (startYear === endYear) {
			return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
		}

		return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
	} catch {
		return "";
	}
}

/**
 * Formats time only for display (e.g., "8:00 AM")
 */
export function formatTimeForDisplay(utcDateStr: string | null, locale: string = "en"): string {
	if (!utcDateStr) return "";

	try {
		const date = new Date(utcDateStr);
		if (Number.isNaN(date.getTime())) return "";

		const browserTz = getBrowserTimezone();

		return new Intl.DateTimeFormat(locale, {
			timeZone: browserTz,
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}).format(date);
	} catch {
		return "";
	}
}
