import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }
      databases: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          database_id: string
          title: string
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          database_id: string
          title: string
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          status?: 'draft' | 'published'
          updated_at?: string
        }
      }
      shared_databases: {
        Row: {
          id: string
          database_id: string
          shared_with_email: string
          permission: 'readonly' | 'editable'
          created_at: string
        }
        Insert: {
          id?: string
          database_id: string
          shared_with_email: string
          permission: 'readonly' | 'editable'
          created_at?: string
        }
        Update: {
          permission?: 'readonly' | 'editable'
        }
      }
    }
  }
}
