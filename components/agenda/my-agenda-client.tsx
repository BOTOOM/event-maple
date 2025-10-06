"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Talk } from "@/lib/types/talk";
import { DateSelector } from "./date-selector";
import { TimelineView } from "./timeline-view";
import { detectConflicts, TalkWithConflict, getTalkColor } from "@/lib/utils/timeline";

interface MyAgendaClientProps {
  talks: Array<Talk & { is_in_my_agenda: boolean }>;
  eventId: number;
  selectedDate: string;
  availableDates: string[];
}

interface RoomLegend {
  room: string;
  colorClasses: string;
  count: number;
}

export function MyAgendaClient({
  talks,
  eventId,
  selectedDate,
  availableDates,
}: MyAgendaClientProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate);
    // Update URL with new date
    router.push(`/events/${eventId}/my-agenda?date=${newDate}`);
  };

  // Detect conflicts
  const talksWithConflicts = detectConflicts(talks) as TalkWithConflict[];

  // Generate dynamic legend based on rooms in talks
  const roomLegends: RoomLegend[] = [];
  const roomMap = new Map<string, { colorClasses: string; count: number }>();

  // Count talks per room and get colors
  talks.forEach((talk) => {
    const room = talk.room || 'Sin sala';
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
              pixelsPerHour={pixelsPerHour}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Legend */}
      {roomLegends.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Salas</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {roomLegends.map((legend, index) => {
              // Extract background color from colorClasses
              const bgColorMatch = legend.colorClasses.match(/bg-(\w+)-(\d+)/);
              const borderColorMatch = legend.colorClasses.match(/border-(\w+)-(\d+)/);
              
              const bgColor = bgColorMatch ? `bg-${bgColorMatch[1]}-${bgColorMatch[2]}` : 'bg-gray-100';
              const borderColor = borderColorMatch ? `border-${borderColorMatch[1]}-${borderColorMatch[2]}` : 'border-gray-300';

              return (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${bgColor} border-2 ${borderColor} flex-shrink-0`}></div>
                  <span className="text-gray-700 truncate">
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
