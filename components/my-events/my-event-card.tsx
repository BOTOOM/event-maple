"use client";

import { BarChart3, Calendar, Eye, MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteEvent } from "@/lib/actions/events";
import { Link } from "@/lib/i18n/navigation";
import { EventWithDetails, getEventDisplayStatus, getEventTitle } from "@/lib/types/event";
import { cn } from "@/lib/utils";
import { formatDateForDisplay } from "@/lib/utils/date";

interface MyEventCardProps {
	readonly event: EventWithDetails;
}

export function MyEventCard({ event }: Readonly<MyEventCardProps>) {
	const t = useTranslations("MyEvents.Card");
	const locale = useLocale();
	const { toast } = useToast();
	const [showMenu, setShowMenu] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const eventTitle = getEventTitle(event);
	const displayStatus = getEventDisplayStatus(event);

	// Format date in user's browser timezone
	const formattedDate = formatDateForDisplay(event.start_at || event.start_date, locale, {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: undefined,
		minute: undefined,
	});

	const formattedTime = event.start_at
		? formatDateForDisplay(event.start_at, locale, {
				hour: "2-digit",
				minute: "2-digit",
				month: undefined,
				day: undefined,
				year: undefined,
			})
		: null;

	const statusConfig = {
		published: {
			label: t("status.published"),
			className: "bg-emerald-600 text-white",
		},
		draft: {
			label: t("status.draft"),
			className: "bg-amber-500 text-white",
		},
		past: {
			label: t("status.past"),
			className: "bg-winter-500 text-white",
		},
	};

	const status = statusConfig[displayStatus];

	const handleDelete = async () => {
		if (!confirm(t("deleteConfirm"))) return;

		setIsDeleting(true);
		const result = await deleteEvent(event.id);

		if (result.success) {
			toast({
				title: t("deleteSuccess"),
			});
		} else {
			toast({
				title: t("deleteError"),
				description: result.error,
				variant: "destructive",
			});
		}
		setIsDeleting(false);
		setShowMenu(false);
	};

	const renderActionButton = () => {
		if (displayStatus === "draft") {
			return (
				<Link href={`/my-events/${event.id}/edit`} className="flex-1">
					<Button variant="default" className="w-full gap-2">
						<Pencil className="h-4 w-4" />
						{t("continueEditing")}
					</Button>
				</Link>
			);
		}

		if (displayStatus === "past") {
			return (
				<Button variant="outline" className="w-full gap-2 cursor-not-allowed opacity-70" disabled>
					<BarChart3 className="h-4 w-4" />
					{t("viewReport")} - {t("comingSoon")}
				</Button>
			);
		}

		return (
			<>
				<Link href={`/events/${event.id}`} className="flex-1">
					<Button variant="outline" className="w-full gap-2">
						<Eye className="h-4 w-4" />
						{t("viewDetails")}
					</Button>
				</Link>
				<Link href={`/my-events/${event.id}/edit`}>
					<Button variant="ghost" size="icon">
						<Pencil className="h-4 w-4" />
					</Button>
				</Link>
			</>
		);
	};

	return (
		<div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group">
			{/* Image */}
			<div className="relative w-full h-48 bg-gradient-to-br from-winter-500 to-winter-900">
				{event.image_url ? (
					<Image src={event.image_url} alt={eventTitle} fill className="object-cover" />
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-white/30 text-sm text-center px-4">{eventTitle}</span>
					</div>
				)}

				{/* Status Badge */}
				<div
					className={cn(
						"absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-medium",
						status.className,
					)}
				>
					{status.label}
				</div>

				{/* Menu Button */}
				<div className="absolute top-3 right-3">
					<button
						type="button"
						onClick={() => setShowMenu(!showMenu)}
						className="p-1.5 rounded-full bg-card/90 hover:bg-card transition-colors"
					>
						<MoreVertical className="h-4 w-4 text-foreground" />
					</button>

					{/* Dropdown Menu */}
					{showMenu && (
						<div className="absolute right-0 mt-1 w-40 bg-card rounded-lg shadow-lg border border-border py-1 z-10">
							<Link
								href={`/my-events/${event.id}/edit`}
								className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface"
								onClick={() => setShowMenu(false)}
							>
								<Pencil className="h-4 w-4" />
								{t("edit")}
							</Link>
							<button
								type="button"
								onClick={handleDelete}
								disabled={isDeleting}
								className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 w-full"
							>
								<Trash2 className="h-4 w-4" />
								{isDeleting ? t("deleting") : t("delete")}
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Content */}
			<div className="p-4 space-y-3">
				<h3 className="text-lg font-semibold text-foreground line-clamp-2">{eventTitle}</h3>

				<div className="space-y-2">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Calendar className="h-4 w-4 flex-shrink-0" />
						<span>
							{formattedDate}
							{formattedTime && ` • ${formattedTime}`}
						</span>
					</div>

					{event.location && (
						<div className="flex items-start gap-2 text-sm text-muted-foreground">
							<MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
							<span className="line-clamp-1">{event.location}</span>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2 pt-2">{renderActionButton()}</div>
			</div>

			{/* Click outside to close menu */}
			{showMenu && (
				<button
					type="button"
					aria-label="Close menu"
					className="fixed inset-0 z-0 cursor-default bg-transparent border-none"
					onClick={() => setShowMenu(false)}
					onKeyDown={(e) => {
						if (e.key === "Escape" || e.key === "Enter") {
							setShowMenu(false);
						}
					}}
				/>
			)}
		</div>
	);
}
