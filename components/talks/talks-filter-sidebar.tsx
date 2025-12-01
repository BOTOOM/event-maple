"use client";

import { X, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface TalksFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  showPastTalks: boolean;
  onShowPastTalksChange: (value: boolean) => void;
}

export function TalksFilterSidebar({
  isOpen,
  onClose,
  showPastTalks,
  onShowPastTalksChange,
}: TalksFilterSidebarProps) {
  const t = useTranslations("Events.FullAgenda.filters");

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto lg:top-4
          w-80 lg:w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          z-50 lg:z-0 overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 lg:p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-gray-900">{t("title")}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Time Filter Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock className="h-4 w-4" />
              <span>{t("timeFilter")}</span>
            </div>

            {/* Toggle for Past Talks */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <Label
                htmlFor="show-past-talks"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {t("showPast")}
              </Label>
              <button
                id="show-past-talks"
                role="switch"
                aria-checked={showPastTalks}
                onClick={() => onShowPastTalksChange(!showPastTalks)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${showPastTalks ? "bg-primary" : "bg-gray-300"}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${showPastTalks ? "translate-x-6" : "translate-x-1"}
                  `}
                />
              </button>
            </div>

            {/* Info text */}
            <p className="text-xs text-gray-500 leading-relaxed">
              {showPastTalks
                ? t("showPastDescOn")
                : t("showPastDescOff")}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Future: Add more filters here */}
          <div className="text-xs text-gray-400 italic">
            {t("moreSoon")}
          </div>
        </div>
      </aside>
    </>
  );
}
