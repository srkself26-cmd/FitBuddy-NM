import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()


def _client() -> genai.Client:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured. Add it to your .env file.")
    return genai.Client(api_key=api_key)


def generate_workout_gemini(
    username: str,
    age: int,
    weight: float,
    goal: str,
    intensity: str,
) -> str:
    client = _client()
    model = os.getenv("GEMINI_WORKOUT_MODEL", "gemini-2.5-flash")

    prompt = f"""
You are FitBuddy, an AI fitness-planning assistant.

Create a practical, general-wellness 7-day workout plan for:
Name: {username}
Age: {age}
Weight: {weight} kg
Goal: {goal}
Preferred intensity: {intensity}

Return exactly these sections:
1. Safety note
2. Weekly overview
3. Day 1 through Day 7
For each day include:
- Focus
- Warm-up (5–10 minutes)
- Main workout with exercise, sets/repetitions or duration
- Rest guidance
- Cooldown/recovery

Requirements:
- Adapt the difficulty to the selected intensity.
- Include at least one recovery/rest-oriented day.
- Do not diagnose, treat, or make medical claims.
- Do not prescribe medication or supplements.
- Do not assume the user has gym equipment; give alternatives where useful.
- Keep the answer clear and easy to follow.
- If pain, injury, pregnancy, a medical condition, or concerning symptoms are relevant, recommend consulting a qualified professional.
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
        raise RuntimeError("Gemini returned an empty workout plan.")
    return text.strip()
