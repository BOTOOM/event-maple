import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { EventsHeader } from "@/components/events/events-header";
import { EventFormClient } from "@/components/my-events/event-form-client";
import { getCategories, getEventById } from "@/lib/actions/events";
import { createClient } from "@/lib/supabase/server";
import { formatDateTimeForTimezone } from "@/lib/utils/date";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("MyEvents.Edit");

	return {
		title: t("pageTitle"),
		description: t("pageDescription"),
	};
}

interface EditEventPageProps {
	readonly params: Promise<{
		eventId: string;
	}>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
	// Check authentication - redirect to login if not authenticated
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const { eventId } = await params;
	const locale = await getLocale();
	const t = await getTranslations("MyEvents.Edit");

	const eventIdNum = Number.parseInt(eventId, 10);
	if (Number.isNaN(eventIdNum)) {
		notFound();
	}

	const [event, categories] = await Promise.all([
		getEventById(eventIdNum, locale),
		getCategories(locale),
	]);

	if (!event?.is_owner) {
		notFound();
	}

	// Convert UTC datetime from Supabase to the event's timezone for editing
	// This ensures the user sees the same time they originally entered
	const eventTimezone = event.timezone || "UTC";

	const initialData = {
		id: event.id,
		name: event.name,
		description: event.description || "",
		start_at: formatDateTimeForTimezone(event.start_at, eventTimezone),
		end_at: formatDateTimeForTimezone(event.end_at, eventTimezone),
		timezone: eventTimezone,
		country_code: event.country_code || "",
		location: event.location || "",
		image_url: event.image_url || "",
		category_id: event.category_id || "",
		status: event.status,
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<EventsHeader />
			<div className="container mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="text-sm text-gray-500 mb-4">
					<span>{t("breadcrumb.myEvents")}</span>
					<span className="mx-2">›</span>
					<span className="text-gray-900">{t("breadcrumb.edit")}</span>
				</nav>

				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
					<p className="text-gray-600 mt-1">{t("subtitle")}</p>
				</div>

				<EventFormClient
					categories={categories}
					locale={locale}
					mode="edit"
					initialData={initialData}
				/>
			</div>
		</div>
	);
}
