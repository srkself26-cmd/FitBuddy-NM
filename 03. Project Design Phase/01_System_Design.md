# FitBuddy – Project Design

## High-Level Architecture

```text
+-----------------------+
|      Web Browser      |
| HTML/CSS/Jinja2 Forms |
+-----------+-----------+
            |
            | HTTP
            v
+-----------------------+
|        FastAPI        |
|       Routes          |
+-----------+-----------+
            |
       +----+----+
       |         |
       v         v
+-------------+  +----------------+
| Gemini      |  | SQLite         |
| Generators  |  | SQLAlchemy     |
+-------------+  +----------------+
       |
       v
+-----------------------+
|     Google Gemini     |
+-----------------------+
```

## Main Modules

### `main.py`
Creates the FastAPI application, mounts static files, includes routes, and initializes the database at startup.

### `routes.py`
Handles the home page, workout generation, feedback submission, health check, and admin dashboard.

### `schemas.py`
Validates user input and feedback using Pydantic.

### `database.py`
Defines User and Plan database models and persistence operations.

### `gemini_generator.py`
Generates the 7-day workout plan.

### `gemini_flash_generator.py`
Generates a concise nutrition/recovery tip.

### `updated_plan.py`
Uses feedback to revise the existing workout plan.

## Data Flow
1. User enters profile information.
2. FastAPI validates the form data.
3. Gemini generates the workout plan and tip.
4. User and plan data are stored in SQLite.
5. The generated result is displayed in the browser.
6. User feedback can trigger a revised plan.
7. Admin can view stored users and plans with the configured password.
