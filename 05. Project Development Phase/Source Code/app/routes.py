import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from .database import (
    get_all_plans,
    get_all_users,
    get_original_plan,
    save_plan,
    save_user,
    update_plan,
)
from .gemini_flash_generator import generate_nutrition_tip_with_flash
from .gemini_generator import generate_workout_gemini
from .schemas import UserInput
from .updated_plan import update_workout_plan

load_dotenv()

router = APIRouter()
BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=BASE_DIR / "templates")


def render_error(request: Request, message: str, status_code: int = 400):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"error": message},
        status_code=status_code,
    )


@router.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"error": None},
    )


@router.get("/health")
def health():
    return {"status": "ok", "service": "fitbuddy"}


@router.post("/generate-workout", response_class=HTMLResponse)
def generate_workout(
    request: Request,
    username: str = Form(...),
    user_id: str = Form(...),
    age: int = Form(...),
    weight: float = Form(...),
    goal: str = Form(...),
    intensity: str = Form(...),
):
    try:
        user = UserInput(
            username=username,
            user_id=user_id,
            age=age,
            weight=weight,
            goal=goal,
            intensity=intensity,
        )

        workout_plan = generate_workout_gemini(
            username=user.username,
            age=user.age,
            weight=user.weight,
            goal=user.goal,
            intensity=user.intensity,
        )
        nutrition_tip = generate_nutrition_tip_with_flash(user.goal)

        save_user(
            user_id=user.user_id,
            username=user.username,
            age=user.age,
            weight=user.weight,
            goal=user.goal,
            intensity=user.intensity,
        )
        save_plan(
            user_id=user.user_id,
            original_plan=workout_plan,
            nutrition_tip=nutrition_tip,
        )

        return templates.TemplateResponse(
            request=request,
            name="result.html",
            context={
                "username": user.username,
                "user_id": user.user_id,
                "age": user.age,
                "weight": user.weight,
                "goal": user.goal,
                "intensity": user.intensity,
                "workout_plan": workout_plan,
                "nutrition_tip": nutrition_tip,
                "feedback_message": None,
                "error": None,
            },
        )
    except ValueError as exc:
        return render_error(request, str(exc))
    except Exception as exc:
        return render_error(request, f"Unable to generate the plan: {exc}", 500)


@router.post("/submit-feedback", response_class=HTMLResponse)
def submit_feedback(
    request: Request,
    user_id: str = Form(...),
    feedback: str = Form(...),
):
    try:
        feedback = feedback.strip()
        if len(feedback) < 3:
            return render_error(request, "Please provide meaningful feedback.")

        plan = get_original_plan(user_id)
        if not plan:
            return render_error(request, "No plan was found for that User ID.")

        from .database import SessionLocal, User
        from sqlalchemy import select

        with SessionLocal() as db:
            user = db.scalar(select(User).where(User.user_id == user_id))

        if not user:
            return render_error(request, "User was not found.")

        revised_plan = update_workout_plan(
            original_plan=plan.original_plan,
            feedback=feedback,
            goal=user.goal,
            intensity=user.intensity,
        )
        nutrition_tip = generate_nutrition_tip_with_flash(user.goal)
        update_plan(user_id, revised_plan, feedback, nutrition_tip)

        return templates.TemplateResponse(
            request=request,
            name="result.html",
            context={
                "username": user.username,
                "user_id": user.user_id,
                "age": user.age,
                "weight": user.weight,
                "goal": user.goal,
                "intensity": user.intensity,
                "workout_plan": revised_plan,
                "nutrition_tip": nutrition_tip,
                "feedback_message": "Your plan was updated using your feedback.",
                "error": None,
            },
        )
    except Exception as exc:
        return render_error(request, f"Unable to update the plan: {exc}", 500)


@router.get("/view-all-users", response_class=HTMLResponse)
def view_all_users(request: Request, admin_password: str = ""):
    expected = os.getenv("ADMIN_PASSWORD", "")
    if not expected or admin_password != expected:
        return templates.TemplateResponse(
            request=request,
            name="all_users.html",
            context={"authorized": False, "users": [], "plans": []},
            status_code=401,
        )

    users = get_all_users()
    plans = get_all_plans()

    return templates.TemplateResponse(
        request=request,
        name="all_users.html",
        context={"authorized": True, "users": users, "plans": plans},
    )
