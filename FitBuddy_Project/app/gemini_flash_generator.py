"""Nutrition/recovery tip generation using Gemini Flash."""
from __future__ import annotations
import os

def generate_nutrition_tip_with_flash(goal: str) -> str:
    import google.generativeai as genai
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured. Add it to .env or the environment.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(f"Give one concise, practical nutrition or recovery tip aligned with a fitness goal of {goal}.")
    return response.text.strip()
