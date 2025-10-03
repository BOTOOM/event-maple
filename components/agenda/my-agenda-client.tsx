"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Talk } from "@/lib/types/talk";
import { DateSelector } from "./date-selector";
import { TimelineView } from "./timeline-view";
import { detectConflicts, TalkWithConflict } from "@/lib/utils/timeline";

interface MyAgendaClientProps {
  talks: Array<Talk & { is_in_my_agenda: boolean }>;
  eventId: number;
  selectedDate: string;
  availableDates: string[];
}

export function MyAgendaClient({
  talks,
  eventId,
  selectedDate,
  availableDates,
}: MyAgendaClientProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate);
    // Update URL with new date
    router.push(`/events/${eventId}/my-agenda?date=${newDate}`);
  };

  // Detect conflicts
  const talksWithConflicts = detectConflicts(talks) as TalkWithConflict[];

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
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Horario del Día
        </h3>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <TimelineView
              talks={talksWithConflicts}
              eventId={eventId}
              startHour={7}
              endHour={20}
              pixelsPerHour={80}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Leyenda</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 border-2 border-gray-300"></div>
            <span className="text-gray-700">Evento Fijo (Registro, Almuerzo)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300"></div>
            <span className="text-gray-700">Auditorio Principal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300"></div>
            <span className="text-gray-700">Sala 1A (Tech Talks)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100 border-2 border-purple-300"></div>
            <span className="text-gray-700">Sala 1B (Workshops)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-pink-100 border-2 border-pink-300"></div>
            <span className="text-gray-700">Sala 1C (Tech Talks)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-100 border-2 border-orange-300"></div>
            <span className="text-gray-700">Sala 1D (Workshops Oracle)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
