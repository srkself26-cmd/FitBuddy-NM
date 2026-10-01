"""Workout-plan generation using Google's Gemini API."""
from __future__ import annotations
import os

def _configure():
    import google.generativeai as genai
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured. Add it to .env or the environment.")
    genai.configure(api_key=api_key)
    return genai

def generate_workout_gemini(username: str, age: int, weight: float, goal: str, intensity: str) -> str:
    genai = _configure()
    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = f"""
Create a practical 7-day fitness plan for:
Name: {username}
Age: {age}
Weight (kg): {weight}
Goal: {goal}
Workout intensity: {intensity}

For each day, include a 5-10 minute warm-up, a main workout with exercise names and sets/reps or duration plus rest guidance, and a cooldown or recovery tip. Keep the format day-wise and easy to follow.
"""
    response = model.generate_content(prompt)
    return response.text.strip()
