# FitBuddy - AI Fitness Plan Generator using Gemini Models

## Submission Team

**Team ID:** `6ab7f6f8c23107aaaa72871e`

**Project:** FitBuddy - AI Fitness Plan Generator using Gemini Models

| No. | Member | Email | Role |
|---:|---|---|---|
| 41 | Jeyadev V J | 9993120258@gcesalem.edu.in | Team Leader |
| 42 | Thangadurai | 9993135880@gcesalem.edu.in | Member |
| 43 | Rishikanth S | 9993084293@gcesalem.edu.in | Member |
| 44 | Indiravarma Elango | 9993083215@gcesalem.edu.in | Member |
| 45 | Sanjay Kumar | 9993137585@gcesalem.edu.in | Member |

## Assumed Working Responsibilities

- **Jeyadev V J:** team coordination, requirements, FastAPI routes and integration.
- **Thangadurai:** frontend/UI, HTML, CSS and Jinja2 templates.
- **Rishikanth S:** Gemini AI integration, prompting, workout generation and plan updates.
- **Indiravarma Elango:** SQLite/SQLAlchemy persistence and admin view.
- **Sanjay Kumar:** testing, deployment support, documentation and submission readiness.

## Phase Dates

| Phase | Date |
|---|---|
| 1. Brainstorming & Ideation | 01 October 2026 |
| 2. Requirement Analysis | 01 October 2026 |
| 3. Project Design Phase | 01 October 2026 |
| 4. Project Planning Phase | 01 October 2026 |
| 5. Project Development Phase | 02 October 2026 |
| 6.Project Testing | 02 October 2026 |
| 7.Project Documentation | 02 October 2026 |
| 8.Project Demonstration | 03 October 2026 |

## Local Run

```bash
python -m venv fitbuddy-env
fitbuddy-env\Scripts\activate
pip install -r requirements.txt
# Create .env and set GOOGLE_API_KEY
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000` and use `/docs` for FastAPI API testing.

## Security Note

The Gemini API key must be supplied through an environment variable. Do not commit a real secret to GitHub.
