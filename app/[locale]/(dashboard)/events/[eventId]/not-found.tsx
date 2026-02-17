import { CalendarX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

export default function EventNotFound() {
	const t = useTranslations("Events.EventNotFound");
	return (
		<div className="min-h-screen bg-surface flex items-center justify-center px-4">
			<div className="text-center">
				<div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<CalendarX className="h-12 w-12 text-red-600" />
				</div>
				<h1 className="text-3xl font-bold text-foreground mb-2">{t("title")}</h1>
				<p className="text-muted-foreground mb-8 max-w-md">
					{t("description")}
				</p>
				<Link href="/events">
					<Button size="lg">{t("backToEvents")}</Button>
				</Link>
			</div>
		</div>
	);
}
