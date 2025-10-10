"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { EmptyEvents } from "@/components/events/empty-events";
import { EventsFilterSidebar } from "@/components/events/events-filter-sidebar";
import { EventsSearch } from "@/components/events/events-search";
import { Event } from "@/lib/types/event";

interface EventsPageClientProps {
  initialEvents: Event[];
}

export function EventsPageClient({ initialEvents }: EventsPageClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get today's date at midnight for comparison
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = initialEvents;

    // Filter by date
    if (!showPastEvents) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.start_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((event) => {
        const eventName = (event.title || event.name || "").toLowerCase();
        const eventDescription = (event.description || "").toLowerCase();
        const eventLocation = (event.location || "").toLowerCase();
        
        return (
          eventName.includes(query) ||
          eventDescription.includes(query) ||
          eventLocation.includes(query)
        );
      });
    }

    return filtered;
  }, [initialEvents, showPastEvents, searchQuery, today]);

  return (
    <div className="flex">
      {/* Sidebar - hidden on mobile by default */}
      <EventsFilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        showPastEvents={showPastEvents}
        onShowPastEventsChange={setShowPastEvents}
      />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 space-y-4">
          {/* Header with filter button */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {showPastEvents ? "All Events" : "Upcoming Events"}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Search bar */}
          <EventsSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search events by name, description, or location..."
          />

          {/* Results count */}
          {searchQuery && (
            <p className="text-sm text-gray-600">
              Found {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Events grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <div className="space-y-3">
                <p className="text-lg font-medium text-gray-900">No events found</p>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <EmptyEvents />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: Event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
