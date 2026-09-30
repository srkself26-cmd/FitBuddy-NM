# FitBuddy – User Guide

## 1. Prerequisites
- Python 3.10+
- VS Code
- Git
- Google Gemini API key

## 2. Install

```bash
python -m venv venv
```

Windows:

```bash
venv\\Scripts\\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## 3. Configure `.env`
Copy `.env.example` to `.env` and set:

```text
GOOGLE_API_KEY=your_gemini_api_key_here
GEMINI_WORKOUT_MODEL=gemini-2.5-flash
GEMINI_TIP_MODEL=gemini-2.5-flash
DATABASE_URL=sqlite:///./fitbuddy.db
ADMIN_PASSWORD=change_this_admin_password
```

Never commit `.env` to GitHub.

## 4. Run

```bash
uvicorn app.main:app --reload
```

Open:
- `http://127.0.0.1:8000`
- `http://127.0.0.1:8000/docs`

## 5. Demo
1. Enter a sample user profile.
2. Generate the workout plan.
3. Read the nutrition/recovery tip.
4. Submit feedback.
5. View the revised plan.
6. Open the admin dashboard with the configured password.
