import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface FitBuddyUser {
  id: string
  user_id: string
  username: string
  age: number
  weight: number
  goal: string
  intensity: string
  created_at: string
}

export interface FitBuddyPlan {
  id: string
  user_id: string
  original_plan: string
  updated_plan: string | null
  nutrition_tip: string
  feedback: string | null
  created_at: string
}

export type Intensity = 'low' | 'medium' | 'high'

export interface UserProfile {
  username: string
  user_id: string
  age: number
  weight: number
  goal: string
  intensity: Intensity
}
