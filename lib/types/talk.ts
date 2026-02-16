export interface Talk {
	id: number; // bigint
	event_id: number;
	title: string;
	short_description: string | null;
	detailed_description: string | null;
	start_time: string; // time (HH:MM:SS)
	end_time: string; // time (HH:MM:SS)
	room: string | null;
	floor: string | null;
	is_fixed: boolean;
	date: string; // DATE - fecha específica de la charla
	speaker_name: string | null;
	speaker_bio: string | null;
	speaker_photo: string | null;
	tags: string[] | null;
	level: string | null;
	capacity: number | null;
}

export interface TalkWithAgendaStatus extends Talk {
	is_in_my_agenda: boolean;
}

// Helper para formatear el rango de horario
export function formatTalkTime(startTime: string, endTime: string): string {
	// startTime y endTime vienen como "HH:MM:SS" o "HH:MM"
	const formatTime = (time: string) => {
		const parts = time.split(":");
		return `${parts[0]}:${parts[1]}`;
	};

	return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

// Helper para formatear la ubicación (Sala + Piso)
export function formatTalkLocation(room: string | null, floor: string | null): string {
	if (room && floor) {
		return `${room}, ${floor}`;
	}
	if (room) {
		return room;
	}
	if (floor) {
		return floor;
	}
	return "Ubicación por confirmar";
}
