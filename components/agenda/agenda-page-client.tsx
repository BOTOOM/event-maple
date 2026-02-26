"use client";

import { parseISO } from "date-fns";
import { Filter } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { EmptyTalks } from "@/components/talks/empty-talks";
import { TalkCard } from "@/components/talks/talk-card";
import { TalksFilterSidebar } from "@/components/talks/talks-filter-sidebar";
import { TalksSearch } from "@/components/talks/talks-search";
import { Button } from "@/components/ui/button";
import { Talk } from "@/lib/types/talk";

interface AgendaPageClientProps {
	readonly talks: Talk[];
	readonly eventId: number;
	readonly agendaTalkIds: Set<number>;
}

export function AgendaPageClient({ talks, eventId, agendaTalkIds }: AgendaPageClientProps) {
	const t = useTranslations("Events.FullAgenda");
	const format = useFormatter();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showPastTalks, setShowPastTalks] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Get current date and time for comparison
	const now = useMemo(() => new Date(), []);

	// Filter and search talks
	const filteredTalks = useMemo(() => {
		let filtered = talks;

		// Filter by date/time
		if (!showPastTalks) {
			filtered = filtered.filter((talk) => {
				try {
					const talkDate = parseISO(talk.date);
					const [hours, minutes] = talk.end_time.split(":").map(Number);
					talkDate.setHours(hours, minutes, 0, 0);
					return talkDate >= now;
				} catch {
					return true; // Include talks with invalid dates
				}
			});
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter((talk) => {
				const title = (talk.title || "").toLowerCase();
				const shortDesc = (talk.short_description || "").toLowerCase();
				const detailedDesc = (talk.detailed_description || "").toLowerCase();
				const speakerName = (talk.speaker_name || "").toLowerCase();
				const room = (talk.room || "").toLowerCase();
				const tags = (talk.tags || []).join(" ").toLowerCase();

				return (
					title.includes(query) ||
					shortDesc.includes(query) ||
					detailedDesc.includes(query) ||
					speakerName.includes(query) ||
					room.includes(query) ||
					tags.includes(query)
				);
			});
		}

		return filtered;
	}, [talks, showPastTalks, searchQuery, now]);

	// Group talks by date
	const talksByDate = useMemo(() => {
		const grouped = new Map<string, Talk[]>();
		filteredTalks.forEach((talk) => {
			const dateKey = talk.date;
			if (!grouped.has(dateKey)) {
				grouped.set(dateKey, []);
			}
			grouped.get(dateKey)!.push(talk);
		});
		return grouped;
	}, [filteredTalks]);

	// Format date headers
	const formatDateHeader = (dateStr: string) => {
		try {
			const date = parseISO(dateStr);
			// Capitalize first letter of weekday
			const weekday = format.dateTime(date, { weekday: "long" });
			const dayMonth = format.dateTime(date, { day: "numeric", month: "long" });
			return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} - ${dayMonth}`;
		} catch {
			return dateStr;
		}
	};

	// Get time range for a group of talks
	const getTimeRange = (talks: Talk[]) => {
		if (talks.length === 0) return "";
		const startTimes = talks
			.map((t) => t.start_time)
			.sort((first, second) => first.localeCompare(second));
		const endTimes = talks
			.map((t) => t.end_time)
			.sort((first, second) => first.localeCompare(second));
		const formatTime = (time: string) => time.substring(0, 5);
		return `${formatTime(startTimes[0])} - ${formatTime(endTimes.at(-1) || endTimes[0])}`;
	};

	return (
		<div className="flex">
			{/* Sidebar */}
			<TalksFilterSidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				showPastTalks={showPastTalks}
				onShowPastTalksChange={setShowPastTalks}
			/>

			<main id="main-content" className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="mb-6 space-y-4">
					{/* Header with filter button */}
					<div className="flex items-center justify-between gap-4">
						<h2 className="text-xl sm:text-2xl font-bold text-foreground">
							{showPastTalks ? t("header.allTalks") : t("header.futureTalks")}
						</h2>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="lg:hidden"
						>
							<Filter className="h-4 w-4 mr-2" />
							{t("header.filters")}
						</Button>
					</div>

					{/* Search bar */}
					<TalksSearch
						value={searchQuery}
						onChange={setSearchQuery}
						placeholder={t("search.placeholder")}
					/>

					{/* Results count */}
					{searchQuery && (
						<p className="text-sm text-muted-foreground">
							{t("results.count", { count: filteredTalks.length })}
						</p>
					)}
				</div>

				{/* Talks List */}
				{filteredTalks.length === 0 ? (
					<div className="text-center py-12">
						{searchQuery ? (
							<div className="space-y-3">
								<p className="text-lg font-medium text-foreground">{t("results.notFound")}</p>
								<p className="text-muted-foreground">{t("results.notFoundDesc")}</p>
							</div>
						) : (
							<EmptyTalks />
						)}
					</div>
				) : (
					<div className="space-y-8">
						{Array.from(talksByDate.entries()).map(([date, dateTalks]) => (
							<div key={date}>
								{/* Date Header */}
								<div className="mb-4">
									<h3 className="text-lg font-semibold text-foreground">{formatDateHeader(date)}</h3>
									<p className="text-sm text-muted-foreground">{getTimeRange(dateTalks)}</p>
								</div>

								{/* Talks for this date */}
								<div className="space-y-3">
									{dateTalks.map((talk) => (
										<TalkCard
											key={talk.id}
											talk={talk}
											eventId={eventId}
											isInAgenda={agendaTalkIds.has(talk.id)}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
