import { format, parseISO } from "date-fns";
import { enUS, es, fr, ptBR } from "date-fns/locale";
import { Award, Calendar, MapPin, User, Users } from "lucide-react";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { AddToAgendaButton } from "@/components/talks/add-to-agenda-button";
import { InfoRow } from "@/components/ui/info-row";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";
import { formatTalkLocation, formatTalkTime } from "@/lib/types/talk";

interface TalkDetailPageProps {
	readonly params: Promise<{
		readonly eventId: string;
		readonly talkId: string;
		readonly locale: string;
	}>;
	readonly searchParams: Promise<{
		readonly from?: string;
	}>;
}

export default async function TalkDetailPage({ params, searchParams }: TalkDetailPageProps) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	const eventId = Number.parseInt(resolvedParams.eventId, 10);
	const talkId = Number.parseInt(resolvedParams.talkId, 10);
	const locale = await getLocale();
	const t = await getTranslations("Events.TalkDetail");

	// Determine back link based on 'from' parameter
	const backLink =
		resolvedSearchParams.from === "my-agenda"
			? `/events/${eventId}/my-agenda`
			: `/events/${eventId}/agenda`;
	const backText =
		resolvedSearchParams.from === "my-agenda" ? t("backToMyAgenda") : t("backToAgenda");

	if (Number.isNaN(eventId) || Number.isNaN(talkId)) {
		notFound();
	}

	// Fetch talk details
	const { data: talk, error: talkError } = await supabase
		.from("talks")
		.select("*")
		.eq("id", talkId)
		.eq("event_id", eventId)
		.single();

	if (talkError || !talk) {
		notFound();
	}

	// Check if talk is in user's agenda
	const { data: agendaItem } = await supabase
		.from("personal_agenda")
		.select("*")
		.eq("user_id", user.id)
		.eq("talk_id", talkId)
		.single();

	const isInAgenda = !!agendaItem;

	const timeRange = formatTalkTime(talk.start_time, talk.end_time);
	const location = formatTalkLocation(talk.room, talk.floor);

	// Format date based on locale
	const formatDate = () => {
		try {
			const date = parseISO(talk.date);
			const localeMap: Record<string, { locale: typeof enUS; format: string }> = {
				en: { locale: enUS, format: "MMMM d, yyyy" },
				es: { locale: es, format: "d 'de' MMMM, yyyy" },
				fr: { locale: fr, format: "d MMMM yyyy" },
				pt: { locale: ptBR, format: "d 'de' MMMM 'de' yyyy" },
			};
			const config = localeMap[locale] || localeMap.en;
			return format(date, config.format, { locale: config.locale });
		} catch {
			return talk.date;
		}
	};

	// Get locationPending from translations
	const locationPendingMap: Record<string, string> = {
		en: "Location to be confirmed",
		es: "Ubicación por confirmar",
		fr: "Lieu à confirmer",
		pt: "Local a confirmar",
	};
	const locationPending = locationPendingMap[locale] || locationPendingMap.en;

	return (
		<div className="min-h-screen bg-gray-50">
			<PageHeader backHref={backLink} backText={backText} mobileTitle={t("mobileTitle")} />

			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
				{/* Title */}
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
					{talk.title}
				</h1>

				{/* Tags & Level */}
				<div className="flex flex-wrap items-center gap-2 mb-6">
					{talk.tags?.map((tag: string) => (
						<span
							key={tag}
							className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
						>
							{tag}
						</span>
					))}
					{talk.level && (
						<span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
							<Award className="h-3.5 w-3.5" />
							{talk.level}
						</span>
					)}
				</div>

				{/* Meta Information */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<div className="space-y-4">
						<InfoRow
							icon={<Calendar className="h-5 w-5 text-gray-700" />}
							label={t("dateTime")}
							value={`${formatDate()} | ${timeRange}`}
						/>
						{location !== locationPending && (
							<InfoRow
								icon={<MapPin className="h-5 w-5 text-gray-700" />}
								label={t("location")}
								value={location}
							/>
						)}
						{talk.speaker_name && (
							<InfoRow
								icon={<User className="h-5 w-5 text-gray-700" />}
								label={t("speaker")}
								value={talk.speaker_name}
							/>
						)}
						{talk.capacity && (
							<InfoRow
								icon={<Users className="h-5 w-5 text-gray-700" />}
								label={t("capacity")}
								value={t("capacityValue", { count: talk.capacity })}
							/>
						)}
					</div>
				</div>

				{/* Speaker Info */}
				{talk.speaker_name && (talk.speaker_bio || talk.speaker_photo) && (
					<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">{t("aboutSpeaker")}</h2>
						<div className="flex items-start gap-4">
							{talk.speaker_photo && (
								<div className="relative w-16 h-16 flex-shrink-0">
									<Image
										src={talk.speaker_photo}
										alt={talk.speaker_name}
										fill
										className="rounded-full object-cover"
									/>
								</div>
							)}
							<div>
								<p className="font-semibold text-gray-900 mb-1">{talk.speaker_name}</p>
								{talk.speaker_bio && (
									<p className="text-gray-700 leading-relaxed">{talk.speaker_bio}</p>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Description */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">{t("description")}</h2>
					<div className="prose prose-gray max-w-none">
						<p className="text-gray-700 leading-relaxed whitespace-pre-line">
							{talk.detailed_description || talk.short_description || t("noDescription")}
						</p>
					</div>
				</div>

				{/* CTA - Add to Agenda */}
				<div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 sm:mx-0 sm:rounded-lg sm:border sm:static">
					<AddToAgendaButton
						talkId={talkId}
						eventId={eventId}
						initialIsInAgenda={isInAgenda}
						variant="button"
					/>
				</div>
			</main>
		</div>
	);
}
