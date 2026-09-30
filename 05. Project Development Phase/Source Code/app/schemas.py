from pydantic import BaseModel, Field, field_validator


ALLOWED_GOALS = {"weight loss", "muscle gain", "general wellness", "flexibility", "endurance"}
ALLOWED_INTENSITIES = {"low", "medium", "high"}


class UserInput(BaseModel):
    user_id: str = Field(min_length=2, max_length=50)
    username: str = Field(min_length=2, max_length=100)
    age: int = Field(ge=13, le=100)
    weight: float = Field(gt=20, le=500)
    goal: str
    intensity: str

    @field_validator("goal")
    @classmethod
    def validate_goal(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_GOALS:
            raise ValueError(f"Goal must be one of: {', '.join(sorted(ALLOWED_GOALS))}")
        return value

    @field_validator("intensity")
    @classmethod
    def validate_intensity(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_INTENSITIES:
            raise ValueError("Intensity must be low, medium, or high")
        return value


class FeedbackRequest(BaseModel):
    user_id: str = Field(min_length=2, max_length=50)
    feedback: str = Field(min_length=3, max_length=1000)
