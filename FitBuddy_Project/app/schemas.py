"""Pydantic request models for form validation."""
from pydantic import BaseModel, Field

class UserInput(BaseModel):
    username: str = Field(min_length=1, max_length=120)
    user_id: str = Field(min_length=1, max_length=100)
    age: int = Field(gt=0, lt=130)
    weight: float = Field(gt=0, lt=500)
    goal: str = Field(min_length=1, max_length=100)
    intensity: str = Field(pattern="^(low|medium|high)$")

class FeedbackRequest(BaseModel):
    user_id: str = Field(min_length=1, max_length=100)
    feedback: str = Field(min_length=1, max_length=2000)
