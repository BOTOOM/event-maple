"use client";

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface DateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  availableDates: string[]; // Array de fechas disponibles
  onDateChange: (date: string) => void;
}

export function DateSelector({
  selectedDate,
  availableDates,
  onDateChange,
}: DateSelectorProps) {
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
      // "Martes, 24 de Octubre"
      return format(date, "EEEE, d 'de' MMMM", { locale: es })
        .replace(/^./, (char) => char.toUpperCase());
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
        aria-label="Día anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-gray-600" />
        <span className="text-lg font-semibold text-gray-900 min-w-[250px] text-center">
          {formatDisplayDate(selectedDate)}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Día siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
