import { ArrowLeft, Calendar, CalendarDays, MapPin, Users } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EventDateDisplay } from "@/components/events/event-date-display";
import { FavoriteButton } from "@/components/events/favorite-button";
import { Button } from "@/components/ui/button";
import { InfoRow } from "@/components/ui/info-row";
import { Link } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEventTitle } from "@/lib/types/event";

interface EventDetailPageProps {
	readonly params: Promise<{
		readonly eventId: string;
		readonly locale: string;
	}>;
}

// Generate Metadata for SEO
export async function generateMetadata(
	{ params }: EventDetailPageProps,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const resolvedParams = await params;
	const eventId = Number.parseInt(resolvedParams.eventId, 10);
	const t = await getTranslations({ locale: resolvedParams.locale, namespace: "Events.Detail" });

	if (Number.isNaN(eventId)) {
		return {
			title: t("notFound"),
		};
	}

	const supabase = await createClient();
	const { data: event } = await supabase.from("events").select("*").eq("id", eventId).single();

	if (!event) {
		return {
			title: t("notFound"),
		};
	}

	const eventTitle = getEventTitle(event);
	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: `${eventTitle} | EventMaple`,
		description: event.description?.substring(0, 160) || `${t("about")} ${eventTitle}`,
		openGraph: {
			title: eventTitle,
			description: event.description?.substring(0, 160),
			images: event.image_url ? [event.image_url, ...previousImages] : previousImages,
			type: "website",
		},
	};
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Convertir eventId de string a number (bigint)
	const resolvedParams = await params;
	const eventId = Number.parseInt(resolvedParams.eventId, 10);
	const t = await getTranslations({ locale: resolvedParams.locale, namespace: "Events.Detail" });

	if (Number.isNaN(eventId)) {
		notFound();
	}

	// Fetch event details
	const { data: event, error } = await supabase
		.from("events")
		.select("*")
		.eq("id", eventId)
		.single();

	if (error || !event) {
		notFound();
	}

	// JSON-LD Structure for Google Rich Snippets
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Event",
		name: getEventTitle(event),
		startDate: event.start_date,
		endDate: event.end_date,
		eventStatus: "https://schema.org/EventScheduled",
		eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
		location: {
			"@type": "Place",
			name: event.location || "Ubicación por definir",
			address: {
				"@type": "PostalAddress",
				addressLocality: event.location || "",
			},
		},
		image: event.image_url ? [event.image_url] : [],
		description: event.description,
		organizer: {
			"@type": "Organization",
			name: event.organizer || "EventMaple User",
			url: "https://event-maple.edwardiaz.dev",
		},
	};

	// Check if event is favorite (only if user is logged in)
	let isFavorite = false;
	if (user) {
		const { data: favoriteData } = await supabase
			.from("users_events")
			.select("*")
			.eq("user_id", user.id)
			.eq("event_id", eventId)
			.eq("favorite", true)
			.single();

		isFavorite = !!favoriteData;
	}

	const eventTitle = getEventTitle(event);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Structured Data for SEO */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			{/* Mobile Header */}
			<div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
				<div className="flex items-center justify-between px-4 h-14">
					<Link href="/events">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-5 w-5" />
						</Button>
					</Link>
					<span className="font-semibold text-gray-900">{t("titleMobile")}</span>
					<FavoriteButton eventId={eventId} initialIsFavorite={isFavorite} />
				</div>
			</div>

			{/* Desktop Header */}
			<div className="hidden md:block sticky top-0 z-40 bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Link href="/events">
							<Button variant="ghost">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{t("back")}
							</Button>
						</Link>
					</div>
				</div>
			</div>

			<main className="container mx-auto px-0 md:px-4 lg:px-8 pb-8">
				{/* Hero Image */}
				<div className="relative w-full h-64 sm:h-80 md:h-96 md:rounded-lg md:mt-6 overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
					{event.image_url ? (
						<Image src={event.image_url} alt={eventTitle} fill className="object-cover" priority />
					) : (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="text-center text-white px-6">
								<Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
								<p className="text-lg opacity-75">{eventTitle}</p>
							</div>
						</div>
					)}

					{/* Desktop: Favorite Button Overlay */}
					<div className="hidden md:block absolute top-4 right-4">
						<div className="bg-white rounded-full shadow-lg">
							<FavoriteButton eventId={eventId} initialIsFavorite={isFavorite} />
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="bg-white md:rounded-lg md:shadow-sm mt-0 md:mt-6 p-6 sm:p-8">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
						{eventTitle}
					</h1>

					{/* Layout: Info Left + Actions Right (Desktop) */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
						{/* Left Column: Event Meta */}
						<div className="lg:col-span-2 space-y-4">
							<InfoRow
								icon={<Calendar className="h-5 w-5 text-gray-700" />}
								label={t("date")}
								value={<EventDateDisplay startAt={event.start_at} startDate={event.start_date} />}
							/>
							{event.location && (
								<InfoRow
									icon={<MapPin className="h-5 w-5 text-gray-700" />}
									label={t("location")}
									value={event.location}
								/>
							)}
							{event.organizer && (
								<InfoRow
									icon={<Users className="h-5 w-5 text-gray-700" />}
									label={t("organizer")}
									value={event.organizer}
								/>
							)}
						</div>

						{/* Right Column: Actions Panel */}
						<div className="lg:col-span-1">
							<div className="bg-gray-50 rounded-lg p-5 space-y-4 border border-gray-200">
								<h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
									{t("actions.title")}
								</h3>

								<div className="space-y-3">
									<Link href={`/events/${eventId}/agenda`} className="block">
										<Button className="w-full" size="lg">
											<CalendarDays className="h-5 w-5 mr-2" />
											{t("actions.fullAgenda")}
										</Button>
									</Link>

									<Link href={`/events/${eventId}/my-agenda`} className="block">
										<Button variant="outline" className="w-full" size="lg">
											<Calendar className="h-5 w-5 mr-2" />
											{t("actions.myAgenda")}
										</Button>
									</Link>
								</div>

								{/* Desktop: Add to Favorites */}
								<div className="pt-3 border-t border-gray-300">
									<FavoriteButton
										eventId={eventId}
										initialIsFavorite={isFavorite}
										variant="button"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Description */}
					{event.description && (
						<div className="border-t border-gray-200 pt-8">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">{t("about")}</h2>
							<div className="prose prose-gray max-w-none">
								<p className="text-gray-700 leading-relaxed whitespace-pre-line">
									{event.description}
								</p>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
