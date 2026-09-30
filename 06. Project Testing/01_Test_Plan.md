# FitBuddy – Testing Plan

## Automated Tests
The project includes `tests/test_app.py` covering:
- Home page availability
- Health endpoint
- Admin dashboard password protection
- Authorized admin dashboard access

Run:

```bash
pytest
```

## Test Cases

| ID | Test | Expected Result |
|---|---|---|
| TC01 | Open `/` | Home page loads |
| TC02 | Open `/health` | JSON health response is returned |
| TC03 | Open admin dashboard without password | HTTP 401 |
| TC04 | Open admin dashboard with configured password | Dashboard loads |
| TC05 | Submit invalid age/weight/goal/intensity | Validation prevents invalid data |
| TC06 | Generate workout with valid Gemini configuration | 7-day plan is returned |
| TC07 | Submit short feedback | Meaningful-feedback validation is shown |
| TC08 | Submit valid feedback for existing user | Revised plan is generated |

## Live Integration Testing
Live Gemini requests require a valid API key, network access, and a configured Gemini model. These should be tested after local configuration.
