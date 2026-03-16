import { useMemo } from "react";
import { Talk } from "@/lib/types/talk";
import { convertTalkScheduleToBrowser } from "@/lib/utils/date";

export interface LocalizedTalk extends Talk {
	browserStartUtcIso: string;
	browserEndUtcIso: string;
	is_in_my_agenda?: boolean;
}

export function useLocalizedTalks<T extends Talk>(
	talks: T[],
	eventTimezone: string,
): (T & LocalizedTalk)[] {
	return useMemo<(T & LocalizedTalk)[]>(
		() =>
			talks
				.map((talk) => {
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
						browserStartUtcIso: localizedSchedule.startUtcIso,
						browserEndUtcIso: localizedSchedule.endUtcIso,
					} as T & LocalizedTalk;
				})
				.sort((first, second) => first.browserStartUtcIso.localeCompare(second.browserStartUtcIso)),
		[talks, eventTimezone],
	);
}
