import type { UserProfile, FitBuddyUser, FitBuddyPlan } from './supabase'
import { supabase } from './supabase'

async function callGemini(action: string, payload: Record<string, unknown>): Promise<string> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-ai`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ action, ...payload }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(errorData.error || `Request failed (${response.status})`)
  }

  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  if (typeof data.result !== 'string') {
    throw new Error('Unexpected response from AI service.')
  }
  return data.result
}

export async function testGeminiConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const result = await callGemini('test', {})
    return { ok: true, message: result }
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Connection failed' }
  }
}

export async function generateWorkoutPlan(profile: UserProfile): Promise<{ workoutPlan: string; nutritionTip: string }> {
  const [workoutPlan, nutritionTip] = await Promise.all([
    callGemini('generate', {
      username: profile.username,
      age: profile.age,
      weight: profile.weight,
      goal: profile.goal,
      intensity: profile.intensity,
    }),
    callGemini('nutrition', { goal: profile.goal }),
  ])
  return { workoutPlan, nutritionTip }
}

export async function updateWorkoutPlan(originalPlan: string, feedback: string): Promise<string> {
  return callGemini('update', { originalPlan, feedback })
}

export async function saveUserToDb(profile: UserProfile): Promise<void> {
  const { error } = await supabase
    .from('fitbuddy_users')
    .upsert({
      user_id: profile.user_id,
      username: profile.username,
      age: profile.age,
      weight: profile.weight,
      goal: profile.goal,
      intensity: profile.intensity,
    }, { onConflict: 'user_id' })

  if (error) throw new Error(`Failed to save user: ${error.message}`)
}

export async function savePlanToDb(userId: string, originalPlan: string, nutritionTip: string): Promise<FitBuddyPlan | null> {
  const { data, error } = await supabase
    .from('fitbuddy_plans')
    .insert({
      user_id: userId,
      original_plan: originalPlan,
      nutrition_tip: nutritionTip,
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to save plan: ${error.message}`)
  return data as FitBuddyPlan
}

export async function updatePlanInDb(userId: string, updatedPlan: string, feedback: string): Promise<FitBuddyPlan | null> {
  const { data: plans, error: selectError } = await supabase
    .from('fitbuddy_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (selectError) throw new Error(`Failed to find plan: ${selectError.message}`)
  if (!plans || plans.length === 0) throw new Error('No plan found for this user.')

  const plan = plans[0] as FitBuddyPlan
  const { data, error } = await supabase
    .from('fitbuddy_plans')
    .update({ updated_plan: updatedPlan, feedback })
    .eq('id', plan.id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update plan: ${error.message}`)
  return data as FitBuddyPlan
}

export async function getUserFromDb(userId: string): Promise<FitBuddyUser | null> {
  const { data, error } = await supabase
    .from('fitbuddy_users')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(`Failed to get user: ${error.message}`)
  return data as FitBuddyUser | null
}

export async function getLatestPlanFromDb(userId: string): Promise<FitBuddyPlan | null> {
  const { data, error } = await supabase
    .from('fitbuddy_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`Failed to get plan: ${error.message}`)
  return data as FitBuddyPlan | null
}

export async function getAllUsersWithPlans(): Promise<{ users: FitBuddyUser[]; plansByUser: Record<string, FitBuddyPlan> }> {
  const { data: users, error: usersError } = await supabase
    .from('fitbuddy_users')
    .select('*')
    .order('created_at', { ascending: true })

  if (usersError) throw new Error(`Failed to load users: ${usersError.message}`)

  const { data: plans, error: plansError } = await supabase
    .from('fitbuddy_plans')
    .select('*')
    .order('created_at', { ascending: true })

  if (plansError) throw new Error(`Failed to load plans: ${plansError.message}`)

  const plansByUser: Record<string, FitBuddyPlan> = {}
  for (const plan of plans as FitBuddyPlan[]) {
    plansByUser[plan.user_id] = plan
  }

  return { users: (users || []) as FitBuddyUser[], plansByUser }
}
