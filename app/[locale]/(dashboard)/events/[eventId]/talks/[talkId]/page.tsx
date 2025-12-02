import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, User, Users, Award } from "lucide-react";
import { InfoRow } from "@/components/ui/info-row";
import { PageHeader } from "@/components/ui/page-header";
import { AddToAgendaButton } from "@/components/talks/add-to-agenda-button";
import { formatTalkTime, formatTalkLocation } from "@/lib/types/talk";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface TalkDetailPageProps {
  params: Promise<{
    eventId: string;
    talkId: string;
  }>;
  searchParams: Promise<{
    from?: string;
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
  
  // Determine back link based on 'from' parameter
  const backLink = resolvedSearchParams.from === 'my-agenda' 
    ? `/events/${eventId}/my-agenda` 
    : `/events/${eventId}/agenda`;
  const backText = resolvedSearchParams.from === 'my-agenda'
    ? 'Volver a Mi Agenda'
    : 'Volver a Agenda';

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

  // Format date
  const formatDate = () => {
    try {
      const date = parseISO(talk.date);
      return format(date, "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return talk.date;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        backHref={backLink}
        backText={backText}
        mobileTitle="Detalles de la Charla"
      />

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
              label="Fecha y hora"
              value={`${formatDate()} | ${timeRange}`}
            />
            {location !== "Ubicación por confirmar" && (
              <InfoRow
                icon={<MapPin className="h-5 w-5 text-gray-700" />}
                label="Ubicación"
                value={location}
              />
            )}
            {talk.speaker_name && (
              <InfoRow
                icon={<User className="h-5 w-5 text-gray-700" />}
                label="Ponente"
                value={talk.speaker_name}
              />
            )}
            {talk.capacity && (
              <InfoRow
                icon={<Users className="h-5 w-5 text-gray-700" />}
                label="Capacidad"
                value={`${talk.capacity} asistentes`}
              />
            )}
          </div>
        </div>

        {/* Speaker Info */}
        {talk.speaker_name && (talk.speaker_bio || talk.speaker_photo) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sobre el Ponente
            </h2>
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
                <p className="font-semibold text-gray-900 mb-1">
                  {talk.speaker_name}
                </p>
                {talk.speaker_bio && (
                  <p className="text-gray-700 leading-relaxed">{talk.speaker_bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {talk.detailed_description || talk.short_description || "Sin descripción disponible."}
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
