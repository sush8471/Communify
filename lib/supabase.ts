// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
