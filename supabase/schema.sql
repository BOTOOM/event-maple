-- EventPlanner Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Talks/Sessions table
CREATE TABLE IF NOT EXISTS public.talks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  room TEXT NOT NULL,
  floor TEXT NOT NULL,
  is_fixed BOOLEAN DEFAULT FALSE, -- Admin-marked fixed events
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorite events (many-to-many)
CREATE TABLE IF NOT EXISTS public.user_favorite_events (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id)
);

-- User favorite talks (many-to-many)
CREATE TABLE IF NOT EXISTS public.user_favorite_talks (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  talk_id UUID REFERENCES public.talks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, talk_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_talks_event_id ON public.talks(event_id);
CREATE INDEX IF NOT EXISTS idx_talks_start_time ON public.talks(start_time);
CREATE INDEX IF NOT EXISTS idx_user_favorite_events_user_id ON public.user_favorite_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_talks_user_id ON public.user_favorite_talks(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_talks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can only read and update their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Events: Everyone can read, only authenticated users can create
CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Talks: Everyone can read
CREATE POLICY "Anyone can view talks" ON public.talks
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create talks" ON public.talks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User Favorite Events: Users can only manage their own favorites
CREATE POLICY "Users can view own favorite events" ON public.user_favorite_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorite events" ON public.user_favorite_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorite events" ON public.user_favorite_events
  FOR DELETE USING (auth.uid() = user_id);

-- User Favorite Talks: Users can only manage their own favorites
CREATE POLICY "Users can view own favorite talks" ON public.user_favorite_talks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorite talks" ON public.user_favorite_talks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorite talks" ON public.user_favorite_talks
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data (optional, remove in production)
INSERT INTO public.events (title, description, date, start_time, end_time, location, organizer, image_url)
VALUES 
  (
    'Conferencia de Tecnología 2024',
    E'Únase a nosotros en el evento tecnológico más esperado del año. Exploraremos las últimas tendencias en inteligencia artificial, desarrollo de software y ciberseguridad. Este evento es una oportunidad única para aprender de expertos de la industria, participar en talleres prácticos y establecer contactos con profesionales de ideas afines. No te pierdas la oportunidad de ser parte del futuro de la tecnología.\n\nHabrá ponencias magistrales, paneles de discusión y sesiones de networking diseñadas para inspirar y educar. ¡Prepárese para un día lleno de innovación y conocimiento!',
    '2024-10-15',
    '09:00',
    '17:00',
    'Centro de Convenciones Metropolitano',
    'Tech Forward Inc.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'
  ),
  (
    'Festival de Música Indie',
    E'Disfruta de una jornada completa con los mejores artistas emergentes de la escena indie. Música en vivo, food trucks gourmet y un ambiente increíble te esperan en este festival imperdible.\n\nContaremos con múltiples escenarios, zonas de descanso y experiencias interactivas para todos los asistentes.',
    '2024-11-22',
    '14:00',
    '23:00',
    'Parque Central',
    'Indie Music Collective',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop'
  ),
  (
    'Taller de Cocina Italiana',
    E'Aprende a preparar auténtica pasta italiana de la mano de chefs profesionales. En este taller práctico descubrirás los secretos de la cocina italiana tradicional, desde cómo hacer pasta fresca hasta preparar las salsas más deliciosas.\n\nIncluye todos los ingredientes y utensilios necesarios. Al final podrás degustar tus propias creaciones.',
    '2024-12-05',
    '16:00',
    '19:00',
    'Escuela de Gastronomía "El Sabor"',
    'Culinary Academy',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop'
  );

-- Insert sample talks for first event
INSERT INTO public.talks (event_id, title, description, start_time, end_time, room, floor, is_fixed)
SELECT 
  id,
  'Keynote: El Futuro de la IA',
  'Charla inaugural sobre las tendencias en inteligencia artificial',
  '2025-03-15 09:30:00+00',
  '2025-03-15 10:30:00+00',
  'Auditorio Principal',
  'Planta Baja',
  true
FROM public.events WHERE title = 'Tech Conference 2025';

INSERT INTO public.talks (event_id, title, description, start_time, end_time, room, floor, is_fixed)
SELECT 
  id,
  'Workshop: React Server Components',
  'Taller práctico sobre Server Components en React',
  '2025-03-15 11:00:00+00',
  '2025-03-15 12:30:00+00',
  'Sala A',
  'Primer Piso',
  false
FROM public.events WHERE title = 'Tech Conference 2025';

INSERT INTO public.talks (event_id, title, description, start_time, end_time, room, floor, is_fixed)
SELECT 
  id,
  'Panel: DevOps en 2025',
  'Panel de expertos sobre las mejores prácticas de DevOps',
  '2025-03-15 11:00:00+00',
  '2025-03-15 12:00:00+00',
  'Sala B',
  'Primer Piso',
  false
FROM public.events WHERE title = 'Tech Conference 2025';
