// Event status type
export type EventStatus = "draft" | "published";

// Event category interface
export interface EventCategory {
	id: string;
	slug: string;
	is_system: boolean;
	is_active: boolean;
	sort_order: number;
	created_at: string;
}

// Event category with translation
export interface EventCategoryWithTranslation extends EventCategory {
	name: string;
	description: string | null;
}

// Category translation interface
export interface EventCategoryTranslation {
	id: string;
	category_id: string;
	locale: string;
	name: string;
	description: string | null;
}

// Base Event interface
export interface Event {
	id: number;
	name: string;
	title?: string;
	description: string | null;
	start_date: string;
	end_date: string;
	start_at: string | null;
	end_at: string | null;
	timezone: string;
	country_code: string | null;
	location: string | null;
	organizer?: string | null;
	image_url?: string | null;
	status: EventStatus;
	category_id: string | null;
	category_name?: string | null;
	created_by: string | null;
	created_at?: string;
	updated_at?: string;
}

// Event with category details
export interface EventWithCategory extends Event {
	category?: EventCategoryWithTranslation | null;
}

// Event with favorite status
export interface EventWithFavorite extends Event {
	is_favorite: boolean;
}

// Event with all relations
export interface EventWithDetails extends EventWithCategory {
	is_favorite?: boolean;
	is_owner?: boolean;
}

// Form data for creating/updating events
export interface EventFormData {
	name: string;
	description: string;
	start_at: string;
	end_at: string;
	timezone: string;
	country_code: string;
	location: string;
	image_url: string;
	category_id: string;
	status: EventStatus;
}

// Filter options for My Events page
export type EventFilterType = "all" | "upcoming" | "past" | "draft";

// Pagination params
export interface EventPaginationParams {
	page: number;
	limit: number;
	search?: string;
	filter?: EventFilterType;
}

// Paginated response
export interface PaginatedEvents {
	events: EventWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Helper para compatibilidad: usar 'name' como 'title'
export function getEventTitle(event: Event): string {
	return event.title || event.name;
}

// Helper to check if event is in the past
export function isEventPast(event: Event): boolean {
	const endDate = event.end_at || event.end_date;
	return new Date(endDate) < new Date();
}

// Helper to get event display status
export function getEventDisplayStatus(event: Event): "published" | "draft" | "past" {
	if (event.status === "draft") return "draft";
	if (isEventPast(event)) return "past";
	return "published";
}
