"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Talk, TalkFormData } from "@/lib/types/talk";

const NOT_AUTHENTICATED_ERROR = "Not authenticated";

type TalkPayloadInput = Omit<TalkFormData, "event_id">;

function toTalkInsertPayload(eventId: number, talk: TalkPayloadInput) {
	return {
		event_id: eventId,
		title: talk.title,
		short_description: talk.short_description || null,
		detailed_description: talk.detailed_description || null,
		date: talk.date,
		start_time: talk.start_time,
		end_time: talk.end_time,
		room: talk.room || null,
		floor: talk.floor || null,
		speaker_name: talk.speaker_name || null,
		speaker_bio: talk.speaker_bio || null,
		speaker_photo: talk.speaker_photo || null,
		tags: talk.tags || [],
		is_fixed: talk.is_fixed || false,
		level: talk.level || null,
		capacity: talk.capacity || null,
	};
}

function toTalkUpdatePayload(talk: TalkPayloadInput) {
	return {
		title: talk.title,
		short_description: talk.short_description || null,
		detailed_description: talk.detailed_description || null,
		date: talk.date,
		start_time: talk.start_time,
		end_time: talk.end_time,
		room: talk.room || null,
		floor: talk.floor || null,
		speaker_name: talk.speaker_name || null,
		speaker_bio: talk.speaker_bio || null,
		speaker_photo: talk.speaker_photo || null,
		tags: talk.tags || [],
		is_fixed: talk.is_fixed || false,
		level: talk.level || null,
		capacity: talk.capacity || null,
	};
}

// Get all talks for a specific event
export async function getTalksByEventId(eventId: number): Promise<Talk[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("talks")
		.select("*")
		.eq("event_id", eventId)
		.order("date", { ascending: true })
		.order("start_time", { ascending: true });

	if (error) {
		console.error("Error fetching talks:", error);
		return [];
	}

	return data as Talk[];
}

// Get a single talk by ID
export async function getTalkById(talkId: number): Promise<Talk | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("talks")
		.select("*")
		.eq("id", talkId)
		.single();

	if (error) {
		console.error("Error fetching talk:", error);
		return null;
	}

	return data as Talk;
}

// Create a new talk
export async function createTalk(
	formData: TalkFormData,
): Promise<{ success: boolean; talkId?: number; error?: string }> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: NOT_AUTHENTICATED_ERROR };
	}

	// Verify event ownership handled by RLS, but we can double check if needed.
	// RLS policy: "Event creators can insert talks" using EXISTS query.

	const payload = toTalkInsertPayload(formData.event_id, formData);

	const { data, error } = await supabase
		.from("talks")
		.insert(payload)
		.select("id")
		.single();

	if (error) {
		console.error("Error creating talk:", error);
		return { success: false, error: error.message };
	}

	revalidatePath(`/[locale]/my-events/${formData.event_id}/edit`, "page");

	return { success: true, talkId: data.id };
}

// Update an existing talk
export async function updateTalk(
	talkId: number,
	formData: Partial<TalkFormData>,
): Promise<{ success: boolean; error?: string }> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: NOT_AUTHENTICATED_ERROR };
	}

	const nullableFields = [
		"short_description", "detailed_description", "room", "floor",
		"speaker_name", "speaker_bio", "speaker_photo", "level", "capacity",
	] as const;

	const directFields = ["title", "date", "start_time", "end_time", "is_fixed"] as const;

	const payload: Record<string, unknown> = {};

	for (const key of directFields) {
		if (formData[key] !== undefined) payload[key] = formData[key];
	}
	for (const key of nullableFields) {
		if (formData[key] !== undefined) payload[key] = formData[key] || null;
	}
	if (formData.tags !== undefined) payload.tags = formData.tags || [];

	const { error } = await supabase.from("talks").update(payload).eq("id", talkId);

	if (error) {
		console.error("Error updating talk:", error);
		return { success: false, error: error.message };
	}

	// We need the event_id to revalidate the path.
	// We can fetch it or pass it. Fetching is safer.
	const { data: talk } = await supabase.from("talks").select("event_id").eq("id", talkId).single();

	if (talk) {
		revalidatePath(`/[locale]/my-events/${talk.event_id}/edit`, "page");
	}

	return { success: true };
}

// Batch create talks (bulk import)
export async function batchCreateTalks(
	eventId: number,
	talksData: Omit<TalkFormData, "event_id">[],
): Promise<{ success: boolean; count?: number; error?: string }> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: NOT_AUTHENTICATED_ERROR };
	}

	if (!talksData.length) {
		return { success: false, error: "No talks to import" };
	}

	const payloads = talksData.map((talk) => toTalkInsertPayload(eventId, talk));

	const { data, error } = await supabase
		.from("talks")
		.insert(payloads)
		.select("id");

	if (error) {
		console.error("Error batch creating talks:", error);
		return { success: false, error: error.message };
	}

	revalidatePath(`/[locale]/my-events/${eventId}/edit`, "page");

	return { success: true, count: data.length };
}

// Batch upsert talks: create new ones and update existing ones (by id)
export async function batchUpsertTalks(
	eventId: number,
	newTalks: Omit<TalkFormData, "event_id">[],
	overwriteTalks: { id: number; data: Omit<TalkFormData, "event_id"> }[],
): Promise<{ success: boolean; error?: string; created: number; updated: number }> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: NOT_AUTHENTICATED_ERROR, created: 0, updated: 0 };
	}

	let created = 0;
	let updated = 0;

	// Insert new talks
	if (newTalks.length > 0) {
		const payloads = newTalks.map((talk) => toTalkInsertPayload(eventId, talk));

		const { data, error } = await supabase.from("talks").insert(payloads).select("id");
		if (error) {
			console.error("Error batch creating talks:", error);
			return { success: false, error: error.message, created: 0, updated: 0 };
		}
		created = data.length;
	}

	// Update existing talks (overwrite)
	for (const item of overwriteTalks) {
		const { error } = await supabase
			.from("talks")
			.update(toTalkUpdatePayload(item.data))
			.eq("id", item.id)
			.eq("event_id", eventId);

		if (error) {
			console.error(`Error updating talk ${item.id}:`, error);
			return { success: false, error: error.message, created, updated };
		}
		updated++;
	}

	revalidatePath(`/[locale]/my-events/${eventId}/edit`, "page");
	return { success: true, created, updated };
}

// Get field suggestions (rooms, floors, tags, levels) from existing talks in an event
export interface TalkFieldSuggestions {
	rooms: string[];
	floors: string[];
	tags: string[];
	levels: string[];
}

const collator = new Intl.Collator(undefined, { sensitivity: "base" });
const sortedArray = (set: Set<string>) => [...set].sort(collator.compare);

function addIfTruthy(set: Set<string>, value: string | null) {
	if (value) set.add(value);
}

function collectTags(tags: string[] | null, set: Set<string>) {
	if (!Array.isArray(tags)) return;
	for (const tag of tags) addIfTruthy(set, tag);
}

function collectFieldValues(data: { room: string | null; floor: string | null; tags: string[] | null; level: string | null }[]) {
	const rooms = new Set<string>();
	const floors = new Set<string>();
	const tags = new Set<string>();
	const levels = new Set<string>();

	for (const row of data) {
		addIfTruthy(rooms, row.room);
		addIfTruthy(floors, row.floor);
		addIfTruthy(levels, row.level);
		collectTags(row.tags, tags);
	}

	return { rooms, floors, tags, levels };
}

export async function getTalkFieldSuggestions(eventId: number): Promise<TalkFieldSuggestions> {
	const supabase = await createClient();

	const { data } = await supabase
		.from("talks")
		.select("room, floor, tags, level")
		.eq("event_id", eventId);

	if (!data) return { rooms: [], floors: [], tags: [], levels: [] };

	const sets = collectFieldValues(data);

	return {
		rooms: sortedArray(sets.rooms),
		floors: sortedArray(sets.floors),
		tags: sortedArray(sets.tags),
		levels: sortedArray(sets.levels),
	};
}

// Delete a talk
export async function deleteTalk(talkId: number): Promise<{ success: boolean; error?: string }> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: NOT_AUTHENTICATED_ERROR };
	}

	// Get event_id before deleting to revalidate
	const { data: talk } = await supabase.from("talks").select("event_id").eq("id", talkId).single();

	const { error } = await supabase.from("talks").delete().eq("id", talkId);

	if (error) {
		console.error("Error deleting talk:", error);
		return { success: false, error: error.message };
	}

	if (talk) {
		revalidatePath(`/[locale]/my-events/${talk.event_id}/edit`, "page");
	}

	return { success: true };
}
