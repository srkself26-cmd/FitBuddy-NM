"""FastAPI routes connecting forms, Gemini functions and SQLite storage."""
from __future__ import annotations
from pathlib import Path

from fastapi import APIRouter, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from .database import get_all_plans, get_all_users, get_original_plan, get_user, save_plan, save_user, update_plan
from .gemini_flash_generator import generate_nutrition_tip_with_flash
from .gemini_generator import generate_workout_gemini
from .schemas import UserInput
from .updated_plan import update_workout_plan

BASE_DIR = Path(__file__).resolve().parent.parent
router = APIRouter()
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.post("/generate-workout", response_class=HTMLResponse)
async def generate_workout(request: Request, username: str = Form(...), user_id: str = Form(...), age: int = Form(...), weight: float = Form(...), goal: str = Form(...), intensity: str = Form(...)):
    user = UserInput(username=username, user_id=user_id, age=age, weight=weight, goal=goal, intensity=intensity.lower())
    workout_plan = generate_workout_gemini(user.username, user.age, user.weight, user.goal, user.intensity)
    nutrition_tip = generate_nutrition_tip_with_flash(user.goal)
    save_user(user.model_dump())
    save_plan(user.user_id, workout_plan, nutrition_tip)
    return templates.TemplateResponse("result.html", {"request": request, "user": user, "workout_plan": workout_plan, "nutrition_tip": nutrition_tip, "updated_plan": None, "message": "Plan generated successfully."})

@router.post("/submit-feedback", response_class=HTMLResponse)
async def submit_feedback(request: Request, user_id: str = Form(...), feedback: str = Form(...)):
    plan = get_original_plan(user_id)
    user = get_user(user_id)
    if not plan or not user:
        return templates.TemplateResponse("result.html", {"request": request, "error": "User ID not found. Generate a plan first."}, status_code=404)
    updated = update_workout_plan(plan.original_plan, feedback)
    update_plan(user_id, updated, feedback)
    return templates.TemplateResponse("result.html", {"request": request, "user": user, "workout_plan": plan.original_plan, "nutrition_tip": plan.nutrition_tip, "updated_plan": updated, "message": "Workout plan updated from feedback."})

@router.get("/view-all-users", response_class=HTMLResponse)
async def view_all_users(request: Request):
    users = get_all_users()
    latest = {p.user_id: p for p in get_all_plans()}
    return templates.TemplateResponse("all_users.html", {"request": request, "users": users, "plans": latest})
