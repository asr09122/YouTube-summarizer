import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      video_summaries: {
        Row: {
          id: string
          user_id: string
          video_url: string
          video_id: string | null
          question: string
          answer: string
          source_type: 'youtube' | 'upload'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_url: string
          video_id?: string | null
          question: string
          answer: string
          source_type?: 'youtube' | 'upload'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_url?: string
          video_id?: string | null
          question?: string
          answer?: string
          source_type?: 'youtube' | 'upload'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}