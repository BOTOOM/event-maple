export interface Event {
  id: number; // bigint en Supabase
  name: string; // campo 'name' en tu schema
  title?: string; // alias para compatibilidad
  description: string | null;
  start_date: string; // date
  end_date: string; // date
  location: string | null;
  organizer?: string | null;
  image_url?: string | null;
  created_by?: number | null;
}

export interface EventWithFavorite extends Event {
  is_favorite: boolean;
}

// Helper para compatibilidad: usar 'name' como 'title'
export function getEventTitle(event: Event): string {
  return event.title || event.name;
}
