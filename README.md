# FitBuddy – AI Fitness Plan Generator

FitBuddy is a FastAPI web application that uses Google's Gemini API to generate personalized 7-day workout plans and nutrition/recovery tips. Users can submit feedback and regenerate an updated plan. An admin dashboard displays stored users and their plans.

## Features

- User-friendly HTML/Jinja2 interface
- Personalized 7-day workout generation
- Nutrition/recovery tip generation
- Feedback-based workout plan updates
- SQLite + SQLAlchemy persistence
- Admin dashboard protected by an environment-configured password
- FastAPI REST endpoints and Swagger documentation
- Gemini API integration
- Input validation
- Error handling and fallback messages
- Basic automated tests
- API key kept outside source control with `.env`

> Safety: FitBuddy provides general wellness information and is not a substitute for a doctor, dietitian, physiotherapist, or other qualified professional. Users should stop exercise that causes pain or concerning symptoms and seek appropriate professional advice.

## Project structure

```text
FitBuddy/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes.py
│   ├── gemini_generator.py
│   ├── gemini_flash_generator.py
│   └── updated_plan.py
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── result.html
│   └── all_users.html
├── static/
│   └── style.css
├── tests/
│   └── test_app.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## 1. Prerequisites

- Python 3.10+
- VS Code
- Git
- A Google Gemini API key

## 2. Create and activate a virtual environment

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use Command Prompt:

```cmd
venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

## 4. Configure environment variables

Copy `.env.example` to `.env`:

```text
GOOGLE_API_KEY=your_gemini_api_key_here
GEMINI_WORKOUT_MODEL=gemini-2.5-flash
GEMINI_TIP_MODEL=gemini-2.5-flash
ADMIN_PASSWORD=change_this_admin_password
DATABASE_URL=sqlite:///./fitbuddy.db
```

Do not upload `.env` to GitHub.

## 5. Run the application

From the project root:

```bash
uvicorn app.main:app --reload
```

Open:

- Web app: http://127.0.0.1:8000
- API docs: http://127.0.0.1:8000/docs
- Admin dashboard: http://127.0.0.1:8000/view-all-users

## 6. Main API endpoints

- `GET /` – home page
- `POST /generate-workout` – generate a workout and nutrition tip
- `POST /submit-feedback` – update a plan from feedback
- `GET /view-all-users` – protected admin dashboard
- `GET /health` – health check

## 7. GitHub upload

```bash
git init
git add .
git commit -m "Initial FitBuddy AI fitness project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/FitBuddy.git
git push -u origin main
```

Before pushing, verify that `.env` is ignored:

```bash
git status
```

You should NOT see `.env`.

## 8. Important deployment note

A GitHub repository stores source code. It does not automatically run a FastAPI server. For a public live demo, deploy the application to a hosting provider that supports Python/FastAPI and configure the Gemini API key as a secret/environment variable there.

## 9. Project documentation mapping

The implementation covers the supplied FitBuddy documentation:

- Model selection / architecture
- Core workout generation
- Nutrition/recovery tips
- Feedback-based plan updates
- User and plan storage
- FastAPI routing
- Jinja2 frontend
- Admin view
- Local deployment
- Testing
- Git/GitHub workflow

## 10. Suggested demo flow

1. Open the home page.
2. Enter a sample user profile.
3. Generate the 7-day plan.
4. Show the nutrition/recovery tip.
5. Submit feedback such as "reduce high-impact exercises and add one recovery day."
6. Show the updated plan.
7. Open the admin dashboard and show the original and updated plans.
8. Open `/docs` and demonstrate the API endpoints.

