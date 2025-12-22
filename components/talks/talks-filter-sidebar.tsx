"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { FilterSidebar } from "@/components/ui/filter-sidebar";

interface TalksFilterSidebarProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly showPastTalks: boolean;
	readonly onShowPastTalksChange: (value: boolean) => void;
}

export function TalksFilterSidebar({
	isOpen,
	onClose,
	showPastTalks,
	onShowPastTalksChange,
}: TalksFilterSidebarProps) {
	const t = useTranslations("Events.FullAgenda.filters");

	return (
		<FilterSidebar
			isOpen={isOpen}
			onClose={onClose}
			title={t("title")}
			footer={t("moreSoon")}
			stickyTop="top-4"
		>
			<FilterSidebar.Section icon={Clock} title={t("timeFilter")}>
				<FilterSidebar.Toggle
					id="show-past-talks"
					label={t("showPast")}
					checked={showPastTalks}
					onChange={onShowPastTalksChange}
					description={showPastTalks ? t("showPastDescOn") : t("showPastDescOff")}
				/>
			</FilterSidebar.Section>
		</FilterSidebar>
	);
}
