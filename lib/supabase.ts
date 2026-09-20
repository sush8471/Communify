// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Demo / hackathon mode ──────────────────────────────────────────────────
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

export type Profile = {
  id: string
  name: string
  username: string
  bio: string
  location: string
  avatar_url: string
  skills: string[]
  interests: string[]
  role: 'member' | 'organizer'
  ai_summary: string
  created_at: string
}

export type Post = {
  id: string
  author_id: string
  type: 'event' | 'resource' | 'announcement'
  title: string
  description: string
  ai_summary: string
  tags: string[]
  location: string
  start_time: string
  status: string
  upvotes: number
  created_at: string
  author?: Profile
}
