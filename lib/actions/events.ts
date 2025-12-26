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
		`
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
	locale: string = "en"
): Promise<PaginatedEvents> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return {
			events: [],
			total: 0,
			page,
			limit: EVENTS_PER_PAGE,
			totalPages: 0,
		};
	}

	const offset = (page - 1) * EVENTS_PER_PAGE;
	const now = new Date().toISOString();

	let query = supabase
		.from("events")
		.select(
			`
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
		`,
			{ count: "exact" }
		)
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
	query = query.order("created_at", { ascending: false }).range(offset, offset + EVENTS_PER_PAGE - 1);

	const { data, error, count } = await query;

	if (error) {
		console.error("Error fetching my events:", error);
		return {
			events: [],
			total: 0,
			page,
			limit: EVENTS_PER_PAGE,
			totalPages: 0,
		};
	}

	const events: EventWithDetails[] = (data || []).map((event) => {
		const category = event.event_categories
			? {
					id: event.event_categories.id,
					slug: event.event_categories.slug,
					is_system: event.event_categories.is_system,
					is_active: event.event_categories.is_active,
					sort_order: event.event_categories.sort_order,
					created_at: event.event_categories.created_at,
					name: event.event_categories.event_category_translations?.[0]?.name || "",
					description:
						event.event_categories.event_category_translations?.[0]?.description || null,
				}
			: null;

		return {
			...event,
			category,
			is_owner: true,
		};
	});

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
	locale: string = "en"
): Promise<EventWithDetails | null> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data, error } = await supabase
		.from("events")
		.select(
			`
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
		`
		)
		.eq("id", eventId)
		.eq("event_categories.event_category_translations.locale", locale)
		.single();

	if (error || !data) {
		console.error("Error fetching event:", error);
		return null;
	}

	const category = data.event_categories
		? {
				id: data.event_categories.id,
				slug: data.event_categories.slug,
				is_system: data.event_categories.is_system,
				is_active: data.event_categories.is_active,
				sort_order: data.event_categories.sort_order,
				created_at: data.event_categories.created_at,
				name: data.event_categories.event_category_translations?.[0]?.name || "",
				description:
					data.event_categories.event_category_translations?.[0]?.description || null,
			}
		: null;

	return {
		...data,
		category,
		is_owner: user?.id === data.created_by,
	};
}

// Create a new event
export async function createEvent(
	formData: EventFormData
): Promise<{ success: boolean; eventId?: number; error?: string }> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Not authenticated" };
	}

	const { data, error } = await supabase
		.from("events")
		.insert({
			name: formData.name,
			description: formData.description,
			start_at: formData.start_at,
			end_at: formData.end_at,
			start_date: formData.start_at.split("T")[0],
			end_date: formData.end_at.split("T")[0],
			timezone: formData.timezone,
			country_code: formData.country_code || null,
			location: formData.location,
			image_url: formData.image_url || null,
			category_id: formData.category_id || null,
			status: formData.status,
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
	formData: Partial<EventFormData>
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Not authenticated" };
	}

	// First check if user owns this event
	const { data: existingEvent } = await supabase
		.from("events")
		.select("created_by")
		.eq("id", eventId)
		.single();

	if (!existingEvent || existingEvent.created_by !== user.id) {
		return { success: false, error: "Not authorized" };
	}

	const updateData: Record<string, unknown> = {};

	if (formData.name !== undefined) updateData.name = formData.name;
	if (formData.description !== undefined) updateData.description = formData.description;
	if (formData.start_at !== undefined) {
		updateData.start_at = formData.start_at;
		updateData.start_date = formData.start_at.split("T")[0];
	}
	if (formData.end_at !== undefined) {
		updateData.end_at = formData.end_at;
		updateData.end_date = formData.end_at.split("T")[0];
	}
	if (formData.timezone !== undefined) updateData.timezone = formData.timezone;
	if (formData.country_code !== undefined)
		updateData.country_code = formData.country_code || null;
	if (formData.location !== undefined) updateData.location = formData.location;
	if (formData.image_url !== undefined) updateData.image_url = formData.image_url || null;
	if (formData.category_id !== undefined) updateData.category_id = formData.category_id || null;
	if (formData.status !== undefined) updateData.status = formData.status;

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
export async function deleteEvent(
	eventId: number
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "Not authenticated" };
	}

	// First check if user owns this event
	const { data: existingEvent } = await supabase
		.from("events")
		.select("created_by")
		.eq("id", eventId)
		.single();

	if (!existingEvent || existingEvent.created_by !== user.id) {
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
export async function publishEvent(
	eventId: number
): Promise<{ success: boolean; error?: string }> {
	return updateEvent(eventId, { status: "published" });
}

// Unpublish an event (change status from published to draft)
export async function unpublishEvent(
	eventId: number
): Promise<{ success: boolean; error?: string }> {
	return updateEvent(eventId, { status: "draft" });
}
