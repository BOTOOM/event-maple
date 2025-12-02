import { CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function EmptyEvents() {
  const t = useTranslations("Events.List.empty");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <CalendarX className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t("title")}
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        {t("description")}
      </p>
      <Button size="lg">{t("action")}</Button>
    </div>
  );
}
