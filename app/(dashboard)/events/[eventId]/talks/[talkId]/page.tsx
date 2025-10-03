import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, User, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToAgendaButton } from "@/components/talks/add-to-agenda-button";
import { formatTalkTime, formatTalkLocation } from "@/lib/types/talk";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface TalkDetailPageProps {
  params: Promise<{
    eventId: string;
    talkId: string;
  }>;
}

export default async function TalkDetailPage({ params }: TalkDetailPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const eventId = parseInt(resolvedParams.eventId, 10);
  const talkId = parseInt(resolvedParams.talkId, 10);

  if (isNaN(eventId) || isNaN(talkId)) {
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
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href={`/events/${eventId}/agenda`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="font-semibold text-gray-900">Detalles de la Charla</span>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/events/${eventId}/agenda`}>
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Agenda
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          {talk.title}
        </h1>

        {/* Tags & Level */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {talk.tags &&
            talk.tags.map((tag: string, index: number) => (
              <span
                key={index}
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
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha y hora</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate()} | {timeRange}
                </p>
              </div>
            </div>

            {location !== "Ubicación por confirmar" && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="text-base font-medium text-gray-900">{location}</p>
                </div>
              </div>
            )}

            {talk.speaker_name && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ponente</p>
                  <p className="text-base font-medium text-gray-900">
                    {talk.speaker_name}
                  </p>
                </div>
              </div>
            )}

            {talk.capacity && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacidad</p>
                  <p className="text-base font-medium text-gray-900">
                    {talk.capacity} asistentes
                  </p>
                </div>
              </div>
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
