import { expect, test } from "@playwright/test";
import { convertTalkScheduleToBrowser } from "../lib/utils/date";

test.describe("Talk timezone conversion utilities", () => {
	test("should convert talk schedule from event timezone to browser timezone", () => {
		const result = convertTalkScheduleToBrowser(
			"2026-06-10",
			"09:00",
			"10:00",
			"Europe/Copenhagen",
			"America/Bogota",
		);

		expect(result.date).toBe("2026-06-10");
		expect(result.startTime).toBe("02:00");
		expect(result.endTime).toBe("03:00");
	});

	test("should handle previous-day shifts when converting to browser timezone", () => {
		const result = convertTalkScheduleToBrowser(
			"2026-06-10",
			"00:30",
			"01:00",
			"Europe/Copenhagen",
			"America/Bogota",
		);

		expect(result.date).toBe("2026-06-09");
		expect(result.startTime).toBe("17:30");
		expect(result.endTime).toBe("18:00");
	});

	test("should handle next-day shifts when converting to browser timezone", () => {
		const result = convertTalkScheduleToBrowser(
			"2026-06-10",
			"23:30",
			"23:45",
			"America/Bogota",
			"Asia/Tokyo",
		);

		expect(result.date).toBe("2026-06-11");
		expect(result.startTime).toBe("13:30");
		expect(result.endTime).toBe("13:45");
	});
});
