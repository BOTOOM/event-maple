import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export function EmptyTalks() {
	const t = useTranslations("Events.EmptyTalks");
	return (
		<div className="text-center py-12 px-4">
			<div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
				<Calendar className="h-8 w-8 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-semibold text-foreground mb-2">{t("title")}</h3>
			<p className="text-muted-foreground max-w-md mx-auto">
				{t("description")}
			</p>
		</div>
	);
}
