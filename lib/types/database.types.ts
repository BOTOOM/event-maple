// Database types for Supabase
// This file will be auto-generated when Supabase is configured

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          location: string;
          organizer: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          location: string;
          organizer: string;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          location?: string;
          organizer?: string;
          image_url?: string | null;
          created_at?: string;
        };
      };
      talks: {
        Row: {
          id: string;
          event_id: string;
          title: string;
          description: string;
          start_time: string;
          end_time: string;
          room: string;
          floor: string;
          is_fixed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          description: string;
          start_time: string;
          end_time: string;
          room: string;
          floor: string;
          is_fixed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          title?: string;
          description?: string;
          start_time?: string;
          end_time?: string;
          room?: string;
          floor?: string;
          is_fixed?: boolean;
          created_at?: string;
        };
      };
      user_favorite_events: {
        Row: {
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          event_id?: string;
          created_at?: string;
        };
      };
      user_favorite_talks: {
        Row: {
          user_id: string;
          talk_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          talk_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          talk_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
