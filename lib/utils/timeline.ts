import { Talk } from "@/lib/types/talk";

export interface TimeSlot {
	hour: number;
	minute: number;
	label: string; // "09:00 AM"
}

export interface TalkWithConflict extends Talk {
	is_in_my_agenda: boolean;
	conflict_column?: number; // Para renderizar conflictos lado a lado
	total_conflicts?: number; // Total de charlas en conflicto en ese horario
}

// Convertir time string (HH:MM:SS) a minutos desde medianoche
export function timeToMinutes(time: string): number {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
}

// Convertir minutos a formato legible
export function minutesToTime(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// Formatear hora para display (09:00 AM)
export function formatTimeDisplay(time: string): string {
	const [hours, minutes] = time.split(":").map(Number);
	const period = hours >= 12 ? "PM" : "AM";
	const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
	return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Generar slots de tiempo para el timeline (cada hora)
export function generateTimeSlots(startHour = 7, endHour = 20): TimeSlot[] {
	const slots: TimeSlot[] = [];
	for (let hour = startHour; hour <= endHour; hour++) {
		const period = hour >= 12 ? "PM" : "AM";
		const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
		slots.push({
			hour,
			minute: 0,
			label: `${displayHour}:00 ${period}`,
		});
	}
	return slots;
}

// Detectar si dos charlas se solapan en horario
export function talksOverlap(talk1: Talk, talk2: Talk): boolean {
	const start1 = timeToMinutes(talk1.start_time);
	const end1 = timeToMinutes(talk1.end_time);
	const start2 = timeToMinutes(talk2.start_time);
	const end2 = timeToMinutes(talk2.end_time);

	// Se solapan si el inicio de una está antes del fin de la otra
	return start1 < end2 && start2 < end1;
}

// Detectar todos los conflictos y asignar columnas para renderizado
export function detectConflicts(talks: Talk[]): TalkWithConflict[] {
	const talksWithConflicts: TalkWithConflict[] = talks.map((talk) => ({
		...talk,
		is_in_my_agenda: false,
		conflict_column: 0,
		total_conflicts: 1,
	}));

	// Ordenar por hora de inicio
	talksWithConflicts.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));

	// Detectar conflictos y asignar columnas
	for (let i = 0; i < talksWithConflicts.length; i++) {
		const currentTalk = talksWithConflicts[i];
		const conflictingTalks = [currentTalk];

		// Buscar charlas que se solapen con la actual
		for (let j = i + 1; j < talksWithConflicts.length; j++) {
			const otherTalk = talksWithConflicts[j];

			// Si la otra charla comienza después de que termine la actual, no hay más conflictos posibles
			if (timeToMinutes(otherTalk.start_time) >= timeToMinutes(currentTalk.end_time)) {
				break;
			}

			if (talksOverlap(currentTalk, otherTalk)) {
				conflictingTalks.push(otherTalk);
			}
		}

		// Asignar columnas si hay conflictos
		if (conflictingTalks.length > 1) {
			conflictingTalks.forEach((talk, index) => {
				talk.conflict_column = index;
				talk.total_conflicts = conflictingTalks.length;
			});
		}
	}

	return talksWithConflicts;
}

// Calcular posición vertical en el timeline (en pixeles)
export function calculateTopPosition(
	time: string,
	startHour: number,
	pixelsPerHour: number,
): number {
	const minutes = timeToMinutes(time);
	const startMinutes = startHour * 60;
	const relativeMinutes = minutes - startMinutes;
	return (relativeMinutes / 60) * pixelsPerHour;
}

// Calcular altura del bloque en el timeline
export function calculateHeight(startTime: string, endTime: string, pixelsPerHour: number): number {
	const startMinutes = timeToMinutes(startTime);
	const endMinutes = timeToMinutes(endTime);
	const durationMinutes = endMinutes - startMinutes;
	return (durationMinutes / 60) * pixelsPerHour;
}

// Obtener color según tipo de charla o sala
export function getTalkColor(talk: Talk): string {
	// Si es evento fijo (is_fixed), usar gris
	if (talk.is_fixed) {
		return "bg-gray-200 border-gray-300 text-gray-700";
	}

	// Colores por sala
	const colorMap: Record<string, string> = {
		"Auditorio El Cubo": "bg-blue-100 border-blue-300 text-blue-900",
		"Sala 1A": "bg-green-100 border-green-300 text-green-900",
		"Sala 1B": "bg-purple-100 border-purple-300 text-purple-900",
		"Sala 1C": "bg-pink-100 border-pink-300 text-pink-900",
		"Sala 1D": "bg-orange-100 border-orange-300 text-orange-900",
	};

	return colorMap[talk.room || ""] || "bg-cyan-100 border-cyan-300 text-cyan-900";
}

// Filtrar charlas por fecha específica
export function filterTalksByDate(talks: Talk[], date: string): Talk[] {
	return talks.filter((talk) => talk.date === date);
}
