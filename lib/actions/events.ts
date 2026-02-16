"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
	EventCategoryWithTranslation,
	EventFilterType,
	EventFormData,
	EventWithDetails,
	PaginatedEvents,
} from "@/lib/types/event";

const EVENTS_PER_PAGE = 9;
const NOT_AUTHENTICATED_ERROR = "Not authenticated";

const EVENT_WITH_CATEGORY_SELECT = `
			*,
			event_categories (
				id,
				slug,
				is_system,
				is_active,
				sort_order,
				created_at,
				event_category_translations!inner (
					name,
					description
				)
			)
		`;

function buildEmptyPaginatedEvents(page: number): PaginatedEvents {
	return {
		events: [],
		total: 0,
		page,
		limit: EVENTS_PER_PAGE,
		totalPages: 0,
	};
}

async function getAuthenticatedContext() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return { supabase, user };
}

async function userOwnsEvent(
	supabase: Awaited<ReturnType<typeof createClient>>,
	eventId: number,
	userId: string,
) {
	const { data: existingEvent } = await supabase
		.from("events")
		.select("created_by")
		.eq("id", eventId)
		.single();

	return !!existingEvent && existingEvent.created_by === userId;
}

function mapEventCategory(rawCategory: any) {
	if (!rawCategory) {
		return null;
	}

	return {
		id: rawCategory.id,
		slug: rawCategory.slug,
		is_system: rawCategory.is_system,
		is_active: rawCategory.is_active,
		sort_order: rawCategory.sort_order,
		created_at: rawCategory.created_at,
		name: rawCategory.event_category_translations?.[0]?.name || "",
		description: rawCategory.event_category_translations?.[0]?.description || null,
	};
}

function mapEventWithDetails(
	rawEvent: any,
	userId?: string,
	forceOwner: boolean = false,
): EventWithDetails {
	return {
		...rawEvent,
		category: mapEventCategory(rawEvent.event_categories),
		is_owner: forceOwner || (!!userId && userId === rawEvent.created_by),
	};
}

function buildEventWritePayload(formData: Partial<EventFormData>) {
	const payload: Record<string, unknown> = {};

	if (formData.name !== undefined) payload.name = formData.name;
	if (formData.description !== undefined) payload.description = formData.description;
	if (formData.start_at !== undefined) {
		payload.start_at = formData.start_at;
		payload.start_date = formData.start_at.split("T")[0];
	}
	if (formData.end_at !== undefined) {
		payload.end_at = formData.end_at;
		payload.end_date = formData.end_at.split("T")[0];
	}
	if (formData.timezone !== undefined) payload.timezone = formData.timezone;
	if (formData.country_code !== undefined) payload.country_code = formData.country_code || null;
	if (formData.location !== undefined) payload.location = formData.location;
	if (formData.image_url !== undefined) payload.image_url = formData.image_url || null;
	if (formData.category_id !== undefined) payload.category_id = formData.category_id || null;
	if (formData.status !== undefined) payload.status = formData.status;

	return payload;
}

// Get categories with translations for a specific locale
export async function getCategories(locale: string): Promise<EventCategoryWithTranslation[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("event_categories")
		.select(
			`
			id,
			slug,
			is_system,
			is_active,
			sort_order,
			created_at,
			event_category_translations!inner (
				name,
				description
			)
		`,
		)
		.eq("is_active", true)
		.eq("event_category_translations.locale", locale)
		.order("sort_order", { ascending: true });

	if (error) {
		console.error("Error fetching categories:", error);
		return [];
	}

	return (data || []).map((cat) => ({
		id: cat.id,
		slug: cat.slug,
		is_system: cat.is_system,
		is_active: cat.is_active,
		sort_order: cat.sort_order,
		created_at: cat.created_at,
		name: (cat.event_category_translations as { name: string; description: string | null }[])[0]
			?.name,
		description: (
			cat.event_category_translations as { name: string; description: string | null }[]
		)[0]?.description,
	}));
}

// Get user's events with pagination and filters
export async function getMyEvents(
	page: number = 1,
	filter: EventFilterType = "all",
	search: string = "",
	locale: string = "en",
): Promise<PaginatedEvents> {
	const { supabase, user } = await getAuthenticatedContext();

	if (!user) {
		return buildEmptyPaginatedEvents(page);
	}

	const offset = (page - 1) * EVENTS_PER_PAGE;
	const now = new Date().toISOString();

	let query = supabase
		.from("events")
		.select(EVENT_WITH_CATEGORY_SELECT, { count: "exact" })
		.eq("created_by", user.id)
		.eq("event_categories.event_category_translations.locale", locale);

	// Apply filters
	if (filter === "upcoming") {
		query = query.eq("status", "published").gte("end_at", now);
	} else if (filter === "past") {
		query = query.eq("status", "published").lt("end_at", now);
	} else if (filter === "draft") {
		query = query.eq("status", "draft");
	}

	// Apply search
	if (search.trim()) {
		query = query.ilike("name", `%${search.trim()}%`);
	}

	// Order and paginate
	query = query
		.order("created_at", { ascending: false })
		.range(offset, offset + EVENTS_PER_PAGE - 1);

	const { data, error, count } = await query;

	if (error) {
		console.error("Error fetching my events:", error);
		return buildEmptyPaginatedEvents(page);
	}

	const events: EventWithDetails[] = (data || []).map((event) => mapEventWithDetails(event, user.id, true));

	const total = count || 0;

	return {
		events,
		total,
		page,
		limit: EVENTS_PER_PAGE,
		totalPages: Math.ceil(total / EVENTS_PER_PAGE),
	};
}

// Get a single event by ID
export async function getEventById(
	eventId: number,
	locale: string = "en",
): Promise<EventWithDetails | null> {
	const { supabase, user } = await getAuthenticatedContext();

	const { data, error } = await supabase
		.from("events")
		.select(EVENT_WITH_CATEGORY_SELECT)
		.eq("id", eventId)
		.eq("event_categories.event_category_translations.locale", locale)
		.single();

	if (error || !data) {
		console.error("Error fetching event:", error);
		return null;
	}

	return mapEventWithDetails(data, user?.id);
}

// Create a new event
export async function createEvent(
	formData: EventFormData,
): Promise<{ success: boolean; eventId?: number; error?: string }> {
	const { supabase, user } = await getAuthenticatedContext();

	if (!user) {
		return { success: false, error: NOT_AUTHENTICATED_ERROR };
	}

	const eventData = buildEventWritePayload(formData);

	const { data, error } = await supabase
		.from("events")
		.insert({
			...eventData,
			created_by: user.id,
		})
		.select("id")
		.single();

	if (error) {
		console.error("Error creating event:", error);
		return { success: false, error: error.message };
	}

	revalidatePath("/[locale]/my-events", "page");

	return { success: true, eventId: data.id };
}

// Update an existing event
export async function updateEvent(
	eventId: number,
	formData: Partial<EventFormData>,
): Promise<{ success: boolean; error?: string }> {
	const { supabase, user } = await getAuthenticatedContext();

	if (!user) {
		return { success: false, error: NOT_AUTHENTICATED_ERROR };
	}

	// First check if user owns this event
	if (!(await userOwnsEvent(supabase, eventId, user.id))) {
		return { success: false, error: "Not authorized" };
	}

	const updateData = buildEventWritePayload(formData);

	const { error } = await supabase.from("events").update(updateData).eq("id", eventId);

	if (error) {
		console.error("Error updating event:", error);
		return { success: false, error: error.message };
	}

	revalidatePath("/[locale]/my-events", "page");
	revalidatePath(`/[locale]/my-events/${eventId}`, "page");

	return { success: true };
}

// Delete an event
export async function deleteEvent(eventId: number): Promise<{ success: boolean; error?: string }> {
	const { supabase, user } = await getAuthenticatedContext();

	if (!user) {
		return { success: false, error: NOT_AUTHENTICATED_ERROR };
	}

	// First check if user owns this event
	if (!(await userOwnsEvent(supabase, eventId, user.id))) {
		return { success: false, error: "Not authorized" };
	}

	const { error } = await supabase.from("events").delete().eq("id", eventId);

	if (error) {
		console.error("Error deleting event:", error);
		return { success: false, error: error.message };
	}

	revalidatePath("/[locale]/my-events", "page");

	return { success: true };
}

// Publish an event (change status from draft to published)
export async function publishEvent(eventId: number): Promise<{ success: boolean; error?: string }> {
	return updateEvent(eventId, { status: "published" });
}

// Unpublish an event (change status from published to draft)
export async function unpublishEvent(
	eventId: number,
): Promise<{ success: boolean; error?: string }> {
	return updateEvent(eventId, { status: "draft" });
}
