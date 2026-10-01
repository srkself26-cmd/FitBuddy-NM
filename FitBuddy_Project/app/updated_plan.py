"""Feedback-based workout-plan revision using Gemini Pro."""
from __future__ import annotations
import os

def update_workout_plan(original_plan: str, feedback: str) -> str:
    import google.generativeai as genai
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured. Add it to .env or the environment.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = f"""
Revise the following 7-day fitness plan according to the user's feedback.
Preserve the useful structure and return the complete revised plan.

ORIGINAL PLAN:
{original_plan}

USER FEEDBACK:
{feedback}
"""
    response = model.generate_content(prompt)
    return response.text.strip()
