# FitBuddy – Presentation Slide Content

## Slide 1 – Title
FitBuddy: AI Fitness Plan Generator

## Slide 2 – Problem
Users may need a structured weekly routine adapted to a selected goal and intensity.

## Slide 3 – Solution
FitBuddy generates a general-wellness 7-day plan with Gemini and supports feedback-based revision.

## Slide 4 – Features
- Workout generation
- Nutrition/recovery tip
- Feedback-based update
- SQLite persistence
- Admin dashboard

## Slide 5 – Technology Stack
FastAPI, Python, Google Gemini, Jinja2, HTML/CSS, SQLAlchemy, SQLite, Pydantic.

## Slide 6 – Architecture
Browser → FastAPI → Gemini / SQLite

## Slide 7 – Routes
`/`, `/health`, `/generate-workout`, `/submit-feedback`, `/view-all-users`

## Slide 8 – Testing
Route tests, admin authorization tests, validation tests, and live Gemini integration testing.

## Slide 9 – Demonstration
Generate plan → show tip → submit feedback → show revised plan → show admin dashboard.

## Slide 10 – Future Scope
Progress tracking, user accounts, exercise library, calendar features, and deployment improvements.
