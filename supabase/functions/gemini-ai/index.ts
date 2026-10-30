import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateRequest {
  action: "generate" | "nutrition" | "update" | "test";
  username?: string;
  age?: number;
  weight?: number;
  goal?: string;
  intensity?: string;
  originalPlan?: string;
  feedback?: string;
}

async function callGemini(prompt: string, model: string): Promise<string> {
  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    throw new Error("Google API key is not configured. Set GOOGLE_API_KEY as an edge function secret.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }
  return text.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: GenerateRequest = await req.json();
    const { action } = body;

    let result: string;

    if (action === "generate") {
      const { username, age, weight, goal, intensity } = body;
      if (!username || !age || !weight || !goal || !intensity) {
        return new Response(
          JSON.stringify({ error: "Missing required fields for plan generation." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const prompt = `
Create a practical 7-day fitness plan for:
Name: ${username}
Age: ${age}
Weight (kg): ${weight}
Goal: ${goal}
Workout intensity: ${intensity}

For each day, include a 5-10 minute warm-up, a main workout with exercise names and sets/reps or duration plus rest guidance, and a cooldown or recovery tip. Keep the format day-wise and easy to follow.`;
      result = await callGemini(prompt, "gemini-2.5-pro");
    } else if (action === "nutrition") {
      const { goal } = body;
      if (!goal) {
        return new Response(
          JSON.stringify({ error: "Missing goal for nutrition tip." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const prompt = `Give one concise, practical nutrition or recovery tip aligned with a fitness goal of ${goal}.`;
      result = await callGemini(prompt, "gemini-2.5-flash");
    } else if (action === "update") {
      const { originalPlan, feedback } = body;
      if (!originalPlan || !feedback) {
        return new Response(
          JSON.stringify({ error: "Missing original plan or feedback for update." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const prompt = `
Revise the following 7-day fitness plan according to the user's feedback.
Preserve the useful structure and return the complete revised plan.

ORIGINAL PLAN:
${originalPlan}

USER FEEDBACK:
${feedback}`;
      result = await callGemini(prompt, "gemini-2.5-pro");
    } else if (action === "test") {
      const testPrompt = "Reply with the single word: connected";
      const text = await callGemini(testPrompt, "gemini-2.5-flash");
      return new Response(
        JSON.stringify({ result: text, status: "ok" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else {
      return new Response(
        JSON.stringify({ error: `Unknown action: ${action}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
