"use client";

import { ChevronDown, Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/i18n/navigation";
import { EventFilterType, EventWithDetails } from "@/lib/types/event";
import { cn } from "@/lib/utils";
import { MyEventCard } from "./my-event-card";

interface MyEventsClientProps {
	readonly initialEvents: EventWithDetails[];
	readonly initialTotal: number;
	readonly initialPage: number;
	readonly initialFilter: EventFilterType;
	readonly initialSearch: string;
	readonly totalPages: number;
}

export function MyEventsClient({
	initialEvents,
	initialTotal,
	initialPage,
	initialFilter,
	initialSearch,
	totalPages,
}: Readonly<MyEventsClientProps>) {
	const t = useTranslations("MyEvents");
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const [searchValue, setSearchValue] = useState(initialSearch);

	const filters: { key: EventFilterType; label: string }[] = [
		{ key: "all", label: t("filters.all") },
		{ key: "upcoming", label: t("filters.upcoming") },
		{ key: "past", label: t("filters.past") },
		{ key: "draft", label: t("filters.draft") },
	];

	const updateSearchParams = (updates: Record<string, string | undefined>) => {
		const params = new URLSearchParams(searchParams.toString());

		Object.entries(updates).forEach(([key, value]) => {
			if (value === undefined || value === "" || (value === "1" && key === "page")) {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});

		// Reset to page 1 when filter or search changes
		if ("filter" in updates || "search" in updates) {
			params.delete("page");
		}

		startTransition(() => {
			router.push(`?${params.toString()}`);
		});
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		updateSearchParams({ search: searchValue });
	};

	const handleFilterChange = (filter: EventFilterType) => {
		updateSearchParams({ filter: filter === "all" ? undefined : filter });
	};

	const handlePageChange = (page: number) => {
		updateSearchParams({ page: page.toString() });
	};

	const renderEventsContent = () => {
		if (isPending) {
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3, 4, 5, 6].map((skeletonId) => (
						<div
							key={`skeleton-${skeletonId}`}
							className="bg-secondary rounded-lg h-80 animate-pulse"
						/>
					))}
				</div>
			);
		}

		if (initialEvents.length === 0) {
			return (
				<div className="text-center py-16">
					<div className="text-muted-foreground mb-4">
						<svg
							className="mx-auto h-16 w-16"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-foreground mb-2">{t("noEvents.title")}</h3>
					<p className="text-muted-foreground mb-6">{t("noEvents.description")}</p>
					<Link href="/my-events/create">
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							{t("createFirstEvent")}
						</Button>
					</Link>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{initialEvents.map((event) => (
					<MyEventCard key={event.id} event={event} />
				))}
			</div>
		);
	};

	return (
		<div className="space-y-6">
			{/* Search and Filters */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				{/* Search */}
				<form onSubmit={handleSearch} className="relative w-full sm:w-80">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder={t("searchPlaceholder")}
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="pl-10 pr-4"
					/>
				</form>

				{/* Filters and Create Button */}
				<div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
					{/* Filter Tabs */}
					<div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
						{filters.map((filter) => (
							<button
								key={filter.key}
								type="button"
								onClick={() => handleFilterChange(filter.key)}
								className={cn(
									"px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
									initialFilter === filter.key
										? "bg-card text-primary shadow-sm"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{filter.label}
								{filter.key === "all" && (
									<span className="ml-1 text-xs text-muted-foreground">{initialTotal}</span>
								)}
							</button>
						))}
					</div>

					{/* Create Button */}
					<Link href="/my-events/create">
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							<span className="hidden sm:inline">{t("createEvent")}</span>
							<span className="sm:hidden">{t("create")}</span>
						</Button>
					</Link>
				</div>
			</div>

			{/* Events Grid */}
			{renderEventsContent()}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-2 pt-6">
					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(initialPage - 1)}
						disabled={initialPage <= 1 || isPending}
					>
						{t("pagination.previous")}
					</Button>

					<span className="text-sm text-muted-foreground px-4">
						{t("pagination.page", { current: initialPage, total: totalPages })}
					</span>

					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(initialPage + 1)}
						disabled={initialPage >= totalPages || isPending}
					>
						{t("pagination.next")}
					</Button>
				</div>
			)}

			{/* Load More (alternative for infinite scroll) */}
			{totalPages > 1 && initialPage < totalPages && (
				<div className="flex justify-center pt-4">
					<button
						type="button"
						onClick={() => handlePageChange(initialPage + 1)}
						disabled={isPending}
						className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						<span>{t("loadMore")}</span>
						<ChevronDown className="h-4 w-4" />
					</button>
				</div>
			)}
		</div>
	);
}
