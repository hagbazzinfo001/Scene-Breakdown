-- Create scenes table
CREATE TABLE IF NOT EXISTS public.scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scene_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create breakdowns table
CREATE TABLE IF NOT EXISTS public.breakdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID NOT NULL REFERENCES public.scenes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  characters TEXT[] DEFAULT '{}',
  locations TEXT[] DEFAULT '{}',
  themes TEXT[] DEFAULT '{}',
  tone TEXT,
  structure TEXT,
  technical_notes TEXT,
  visual_elements TEXT,
  emotional_arc TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breakdowns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for scenes
CREATE POLICY "Users can view their own scenes" ON public.scenes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scenes" ON public.scenes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scenes" ON public.scenes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scenes" ON public.scenes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for breakdowns
CREATE POLICY "Users can view their own breakdowns" ON public.breakdowns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own breakdowns" ON public.breakdowns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own breakdowns" ON public.breakdowns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own breakdowns" ON public.breakdowns
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS scenes_user_id_idx ON public.scenes(user_id);
CREATE INDEX IF NOT EXISTS breakdowns_scene_id_idx ON public.breakdowns(scene_id);
CREATE INDEX IF NOT EXISTS breakdowns_user_id_idx ON public.breakdowns(user_id);
