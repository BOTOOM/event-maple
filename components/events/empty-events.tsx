"use client";

import { CalendarX, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { Link } from "@/lib/i18n/navigation";

export function EmptyEvents() {
	const t = useTranslations("Events.List.empty");
	const { user } = useAuth();

	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
			<div className="w-24 h-24 bg-winter-100 rounded-full flex items-center justify-center mb-6">
				<CalendarX className="h-12 w-12 text-primary" />
			</div>
			<h2 className="text-2xl font-bold text-foreground mb-2">{t("title")}</h2>
			<p className="text-muted-foreground mb-8 max-w-md">{t("description")}</p>

			{user ? (
				<div className="flex flex-col sm:flex-row gap-3">
					<Link href="/my-events/create">
						<Button size="lg">
							<Plus className="h-5 w-5 mr-2" />
							{t("createEvent")}
						</Button>
					</Link>
					<Link href="/my-events">
						<Button size="lg" variant="outline">
							{t("viewMyEvents")}
						</Button>
					</Link>
				</div>
			) : (
				<Link href="/login">
					<Button size="lg">{t("action")}</Button>
				</Link>
			)}
		</div>
	);
}
