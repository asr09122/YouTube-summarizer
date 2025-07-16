/*
  # Create video summaries table

  1. New Tables
    - `video_summaries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `video_url` (text)
      - `video_id` (text, nullable for uploaded videos)
      - `question` (text)
      - `answer` (text)
      - `source_type` (text, 'youtube' or 'upload')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `video_summaries` table
    - Add policies for authenticated users to manage their own summaries
*/

CREATE TABLE IF NOT EXISTS video_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  video_url text NOT NULL,
  video_id text,
  question text NOT NULL,
  answer text NOT NULL,
  source_type text NOT NULL DEFAULT 'youtube' CHECK (source_type IN ('youtube', 'upload')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_summaries ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own summaries
CREATE POLICY "Users can view own summaries"
  ON video_summaries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own summaries
CREATE POLICY "Users can insert own summaries"
  ON video_summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own summaries
CREATE POLICY "Users can update own summaries"
  ON video_summaries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own summaries
CREATE POLICY "Users can delete own summaries"
  ON video_summaries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_video_summaries_user_created 
  ON video_summaries(user_id, created_at DESC);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_video_summaries_updated_at
    BEFORE UPDATE ON video_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();