import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()


def generate_nutrition_tip_with_flash(goal: str) -> str:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured. Add it to your .env file.")

    client = genai.Client(api_key=api_key)
    model = os.getenv("GEMINI_TIP_MODEL", "gemini-2.5-flash")

    prompt = f"""
Give one concise, practical nutrition or recovery tip for a person whose fitness goal is "{goal}".

Rules:
- Maximum about 100 words.
- Focus on balanced food, hydration, sleep, or recovery.
- Do not prescribe supplements or medication.
- Do not provide medical treatment.
- Use simple language.
"""

    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.4,
            max_output_tokens=300,
        ),
    )
    text = getattr(response, "text", None)
    if not text:
        raise RuntimeError("Gemini returned an empty nutrition tip.")
    return text.strip()
