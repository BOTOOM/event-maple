"use client";

import { Link } from "@/lib/i18n/navigation";
import { usePathname } from "next/navigation";
import { ArrowLeft, Calendar, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface AgendaHeaderProps {
  eventId: number;
  eventTitle: string;
}

export function AgendaHeader({ eventId, eventTitle }: AgendaHeaderProps) {
  const pathname = usePathname();
  const isMyAgenda = pathname?.includes("/my-agenda");
  const t = useTranslations("Events.Header");
  const tMyAgenda = useTranslations("Events.MyAgenda");

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-14">
          <Link href={`/events/${eventId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="font-semibold text-gray-900 truncate max-w-[60%]">
            {isMyAgenda ? t("nav.myAgenda") : t("nav.fullAgenda")}
          </span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href={`/events/${eventId}`}>
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("backToEvent")}
              </Button>
            </Link>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {eventTitle}
              </h1>
              <p className="text-sm text-gray-500">
                {isMyAgenda ? tMyAgenda("subtitleMyAgenda") : tMyAgenda("subtitleAllTalks")}
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop Only */}
          <div className="flex items-center gap-2">
            <Link href={`/events/${eventId}/agenda`}>
              <Button
                variant={!isMyAgenda ? "default" : "outline"}
                className={cn(
                  "gap-2",
                  !isMyAgenda && "shadow-sm"
                )}
              >
                <Calendar className="h-4 w-4" />
                {t("nav.fullAgenda")}
              </Button>
            </Link>
            <Link href={`/events/${eventId}/my-agenda`}>
              <Button
                variant={isMyAgenda ? "default" : "outline"}
                className={cn(
                  "gap-2",
                  isMyAgenda && "shadow-sm"
                )}
              >
                <CalendarCheck className="h-4 w-4" />
                {t("nav.myAgenda")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-gray-200">
          <Link
            href={`/events/${eventId}/agenda`}
            className={cn(
              "flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors",
              !isMyAgenda
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {t("nav.fullAgenda")}
          </Link>
          <Link
            href={`/events/${eventId}/my-agenda`}
            className={cn(
              "flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors",
              isMyAgenda
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {t("nav.myAgenda")}
          </Link>
        </div>
      </div>
    </div>
  );
}
