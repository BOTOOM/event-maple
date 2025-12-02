"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { FilterSidebar } from "@/components/ui/filter-sidebar";

interface EventsFilterSidebarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly showPastEvents: boolean;
  readonly onShowPastEventsChange: (value: boolean) => void;
}

export function EventsFilterSidebar({
  isOpen,
  onClose,
  showPastEvents,
  onShowPastEventsChange,
}: EventsFilterSidebarProps) {
  const t = useTranslations("Events.List.filters");

  return (
    <FilterSidebar
      isOpen={isOpen}
      onClose={onClose}
      title={t("button")}
      footer={t("moreSoon")}
    >
      <FilterSidebar.Section icon={Calendar} title={t("dateRange")}>
        <FilterSidebar.Toggle
          id="show-past-events"
          label={t("showPast")}
          checked={showPastEvents}
          onChange={onShowPastEventsChange}
          description={showPastEvents ? t("showingAll") : t("showingToday")}
        />
      </FilterSidebar.Section>
    </FilterSidebar>
  );
}
