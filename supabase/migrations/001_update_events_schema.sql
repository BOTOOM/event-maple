-- Migration: Update events table to add start_time and end_time fields
-- This migration is for existing databases

-- Add new columns if they don't exist
ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS start_time TEXT,
  ADD COLUMN IF NOT EXISTS end_time TEXT;

-- Update the date column type if needed (from TIMESTAMP to DATE)
-- Note: This is optional and should be done carefully in production
-- ALTER TABLE public.events ALTER COLUMN date TYPE DATE USING date::DATE;

-- Update existing events with default times if they don't have them
UPDATE public.events 
SET 
  start_time = '09:00',
  end_time = '17:00'
WHERE start_time IS NULL AND end_time IS NULL;
