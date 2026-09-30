import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()


def update_workout_plan(original_plan: str, feedback: str, goal: str, intensity: str) -> str:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured. Add it to your .env file.")

    client = genai.Client(api_key=api_key)
    model = os.getenv("GEMINI_WORKOUT_MODEL", "gemini-2.5-flash")

    prompt = f"""
You are updating an existing AI-generated 7-day fitness plan.

Fitness goal: {goal}
Intensity: {intensity}

Original plan:
---BEGIN ORIGINAL PLAN---
{original_plan}
---END ORIGINAL PLAN---

User feedback:
---BEGIN FEEDBACK---
{feedback}
---END FEEDBACK---

Create a revised 7-day plan that addresses the feedback while preserving useful parts of the original.

Return:
1. What was changed (brief)
2. Revised Day 1 through Day 7
3. Safety/recovery note

Do not diagnose or treat medical conditions. Do not prescribe medication or supplements.
If the feedback suggests an injury, serious pain, or medical issue, recommend professional guidance instead of attempting medical treatment.
"""

    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.5,
            max_output_tokens=2500,
        ),
    )
    text = getattr(response, "text", None)
    if not text:
        raise RuntimeError("Gemini returned an empty updated plan.")
    return text.strip()
