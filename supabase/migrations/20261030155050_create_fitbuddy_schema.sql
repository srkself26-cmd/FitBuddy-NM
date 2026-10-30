/*
# Create FitBuddy database schema (single-tenant, no auth)

## Overview
Creates two tables — `fitbuddy_users` and `fitbuddy_plans` — to store user fitness profiles
and the AI-generated workout plans that go with them. This is a no-auth app (no sign-in
screen), so all policies target `anon, authenticated` and data is intentionally public/shared.

## New Tables

### fitbuddy_users
- `id` (uuid, primary key, auto-generated)
- `user_id` (text, unique, user-supplied identifier like "user_001")
- `username` (text, display name)
- `age` (integer, user's age)
- `weight` (double precision, user's weight in kg)
- `goal` (text, fitness goal: "weight loss", "muscle gain", etc.)
- `intensity` (text, workout intensity: "low", "medium", "high")
- `created_at` (timestamptz, default now)

### fitbuddy_plans
- `id` (uuid, primary key, auto-generated)
- `user_id` (text, references fitbuddy_users.user_id, cascade delete)
- `original_plan` (text, the Gemini-generated 7-day workout plan)
- `updated_plan` (text, nullable, the feedback-revised plan)
- `nutrition_tip` (text, Gemini Flash-generated nutrition/recovery tip)
- `feedback` (text, nullable, the user feedback that produced updated_plan)
- `created_at` (timestamptz, default now)

## Security
- RLS enabled on both tables.
- Grants: CRUD on both tables for `anon, authenticated` + `service_role` (edge function uses service role).
- Policies: allow `anon, authenticated` full CRUD (single-tenant, intentionally shared data).
- Index on `fitbuddy_plans.user_id` for efficient lookups.
*/

CREATE TABLE IF NOT EXISTS fitbuddy_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  username text NOT NULL,
  age integer NOT NULL,
  weight double precision NOT NULL,
  goal text NOT NULL,
  intensity text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitbuddy_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES fitbuddy_users(user_id) ON DELETE CASCADE,
  original_plan text NOT NULL,
  updated_plan text,
  nutrition_tip text NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fitbuddy_plans_user_id ON fitbuddy_plans(user_id);

ALTER TABLE fitbuddy_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitbuddy_plans ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON fitbuddy_users TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON fitbuddy_plans TO anon, authenticated, service_role;

-- fitbuddy_users policies
DROP POLICY IF EXISTS "anon_select_users" ON fitbuddy_users;
CREATE POLICY "anon_select_users" ON fitbuddy_users
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_users" ON fitbuddy_users;
CREATE POLICY "anon_insert_users" ON fitbuddy_users
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_users" ON fitbuddy_users;
CREATE POLICY "anon_update_users" ON fitbuddy_users
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_users" ON fitbuddy_users;
CREATE POLICY "anon_delete_users" ON fitbuddy_users
  FOR DELETE TO anon, authenticated USING (true);

-- fitbuddy_plans policies
DROP POLICY IF EXISTS "anon_select_plans" ON fitbuddy_plans;
CREATE POLICY "anon_select_plans" ON fitbuddy_plans
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_plans" ON fitbuddy_plans;
CREATE POLICY "anon_insert_plans" ON fitbuddy_plans
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_plans" ON fitbuddy_plans;
CREATE POLICY "anon_update_plans" ON fitbuddy_plans
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_plans" ON fitbuddy_plans;
CREATE POLICY "anon_delete_plans" ON fitbuddy_plans
  FOR DELETE TO anon, authenticated USING (true);
