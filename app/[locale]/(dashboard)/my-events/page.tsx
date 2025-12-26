import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMyEvents } from "@/lib/actions/events";
import { MyEventsClient } from "@/components/my-events/my-events-client";
import { EventsHeader } from "@/components/events/events-header";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("MyEvents");

	return {
		title: t("pageTitle"),
		description: t("pageDescription"),
	};
}

interface MyEventsPageProps {
	searchParams: Promise<{
		page?: string;
		filter?: string;
		search?: string;
	}>;
}

export default async function MyEventsPage({ searchParams }: MyEventsPageProps) {
	// Check authentication - redirect to login if not authenticated
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	
	if (!user) {
		redirect("/login");
	}

	const params = await searchParams;
	const locale = await getLocale();
	const t = await getTranslations("MyEvents");

	const page = Number.parseInt(params.page || "1", 10);
	const filter = (params.filter as "all" | "upcoming" | "past" | "draft") || "all";
	const search = params.search || "";

	const { events, total, totalPages } = await getMyEvents(page, filter, search, locale);

	return (
		<div className="min-h-screen bg-gray-50">
			<EventsHeader />
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
						<p className="text-gray-600 mt-1">{t("subtitle")}</p>
					</div>
				</div>

				<MyEventsClient
					initialEvents={events}
					initialTotal={total}
					initialPage={page}
					initialFilter={filter}
					initialSearch={search}
					totalPages={totalPages}
				/>
			</div>
		</div>
	);
}
