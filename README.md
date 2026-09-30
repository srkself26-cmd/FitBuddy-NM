# FitBuddy – AI Fitness Plan Generator

FitBuddy is a FastAPI web application that uses Google Gemini to generate personalized general-wellness 7-day workout plans and nutrition/recovery tips. Users can submit feedback and regenerate an updated plan. SQLite + SQLAlchemy store users and plans, and a password-protected demonstration dashboard displays stored records.

## GitHub Submission Structure

1. `01. Brainstorming & Ideation/`
2. `02. Requirement Analysis/`
3. `03. Project Design Phase/`
4. `04. Project Planning Phase/`
5. `05. Project Development Phase/`
6. `06. Project Testing/`
7. `07. Project Documentation/`
8. `08. Project Demonstration/`

The complete working application is inside:

`05. Project Development Phase/Source Code/`

## Quick Start

```bash
cd "05. Project Development Phase/Source Code"
python -m venv venv
```

Windows:

```bash
venv\\Scripts\\activate
```

Install:

```bash
pip install -r requirements.txt
```

Create `.env` from `.env.example` and add your Gemini API key and admin password.

Run:

```bash
uvicorn app.main:app --reload
```

Open:
- `http://127.0.0.1:8000`
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/view-all-users`

Run tests:

```bash
pytest
```

## Safety
FitBuddy provides general wellness information and is not a substitute for a doctor, dietitian, physiotherapist, or other qualified professional. The generated prompts explicitly avoid diagnosis, treatment, medication, and supplement prescriptions.

## Security
Do not commit `.env`, API keys, or production passwords to GitHub. Configure secrets through the deployment platform when deploying publicly.

## Live Gemini Note
The source code can be syntax-checked and locally tested without making a live model request, but actual Gemini generation requires a valid API key, network access, and a configured model.
