# FitBuddy – Project Report

## Abstract
FitBuddy is a FastAPI-based AI fitness plan generator that uses Google Gemini to create a general-wellness 7-day workout plan and a concise nutrition/recovery tip. Users can submit feedback to revise their plan. User and plan information is stored with SQLite and SQLAlchemy, and a password-protected demonstration dashboard provides access to stored records.

## Objectives
1. Generate a structured 7-day workout plan.
2. Provide nutrition/recovery guidance.
3. Revise plans using user feedback.
4. Demonstrate Generative AI integration with FastAPI.
5. Persist user and plan information.
6. Provide an administrative demonstration view.

## Technology Stack
- Python
- FastAPI
- Uvicorn
- Jinja2
- HTML/CSS
- Google Gemini
- SQLAlchemy
- SQLite
- Pydantic
- pytest

## API / Web Routes
- `GET /`
- `GET /health`
- `POST /generate-workout`
- `POST /submit-feedback`
- `GET /view-all-users`

## Future Enhancements
- Authentication and role management
- User accounts and workout history
- Progress tracking
- Exercise library with images/video
- Calendar integration
- More detailed preference inputs
- Deployment with managed secrets
