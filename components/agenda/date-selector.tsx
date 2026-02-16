"use client";

import { format, parseISO } from "date-fns";
import { enUS, es, fr, pt } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const localeMap: Record<string, typeof es> = { es, en: enUS, fr, pt };

interface DateSelectorProps {
	selectedDate: string; // YYYY-MM-DD
	availableDates: string[]; // Array de fechas disponibles
	onDateChange: (date: string) => void;
}

export function DateSelector({ selectedDate, availableDates, onDateChange }: DateSelectorProps) {
	const locale = useLocale();
	const t = useTranslations("Events.DateSelector");
	const dateFnsLocale = localeMap[locale] || es;
	const currentIndex = availableDates.indexOf(selectedDate);
	const canGoPrevious = currentIndex > 0;
	const canGoNext = currentIndex < availableDates.length - 1;

	const handlePrevious = () => {
		if (canGoPrevious) {
			onDateChange(availableDates[currentIndex - 1]);
		}
	};

	const handleNext = () => {
		if (canGoNext) {
			onDateChange(availableDates[currentIndex + 1]);
		}
	};

	const formatDisplayDate = (dateStr: string) => {
		try {
			const date = parseISO(dateStr);
			return format(date, "EEEE, d MMMM", { locale: dateFnsLocale }).replace(/^./, (char) =>
				char.toUpperCase(),
			);
		} catch {
			return dateStr;
		}
	};

	return (
		<div className="flex items-center justify-center gap-4 py-4">
			<Button
				variant="ghost"
				size="icon"
				onClick={handlePrevious}
				disabled={!canGoPrevious}
				aria-label={t("previousDay")}
			>
				<ChevronLeft className="h-5 w-5" />
			</Button>

			<div className="flex items-center gap-2">
				<CalendarIcon className="h-5 w-5 text-muted-foreground" />
				<span className="text-lg font-semibold text-foreground min-w-[250px] text-center">
					{formatDisplayDate(selectedDate)}
				</span>
			</div>

			<Button
				variant="ghost"
				size="icon"
				onClick={handleNext}
				disabled={!canGoNext}
				aria-label={t("nextDay")}
			>
				<ChevronRight className="h-5 w-5" />
			</Button>
		</div>
	);
}
