# FitBuddy – Requirement Analysis

## Functional Requirements

### FR1 – User Profile Input
The system shall accept username, user ID, age, weight, fitness goal, and preferred intensity.

### FR2 – Workout Generation
The system shall generate a 7-day general-wellness workout plan using Gemini.

### FR3 – Nutrition/Recovery Tip
The system shall generate a concise nutrition or recovery tip based on the user's goal.

### FR4 – Feedback Update
The system shall accept user feedback and generate a revised workout plan.

### FR5 – Data Persistence
The system shall store users and workout plans in SQLite using SQLAlchemy.

### FR6 – Admin Dashboard
The system shall provide a password-protected demonstration dashboard for stored users and plans.

### FR7 – Health Check
The system shall provide a `/health` endpoint.

## Validation Requirements
- Age: 13–100
- Weight: greater than 20 kg and up to 500 kg
- Goal: weight loss, muscle gain, general wellness, flexibility, or endurance
- Intensity: low, medium, or high
- Feedback: 3–1000 characters

## Non-Functional Requirements
- Simple browser interface
- Modular Python backend
- Environment-based API configuration
- Input validation and error handling
- API documentation through FastAPI Swagger
- Basic automated testing
