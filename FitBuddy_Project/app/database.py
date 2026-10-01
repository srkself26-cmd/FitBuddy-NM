"""SQLite persistence helpers for FitBuddy."""
from __future__ import annotations

from pathlib import Path
from typing import Optional

from sqlalchemy import create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column
from sqlalchemy.types import Float, Integer, String, Text

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "fitbuddy.db"
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(120))
    age: Mapped[int] = mapped_column(Integer)
    weight: Mapped[float] = mapped_column(Float)
    goal: Mapped[str] = mapped_column(String(100))
    intensity: Mapped[str] = mapped_column(String(20))

class Plan(Base):
    __tablename__ = "plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(100), index=True)
    original_plan: Mapped[str] = mapped_column(Text)
    updated_plan: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    nutrition_tip: Mapped[str] = mapped_column(Text)
    feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

def init_db() -> None:
    Base.metadata.create_all(engine)

def save_user(data: dict) -> None:
    with Session(engine) as session:
        existing = session.scalar(select(User).where(User.user_id == data["user_id"]))
        if existing:
            for key in ("username", "age", "weight", "goal", "intensity"):
                setattr(existing, key, data[key])
        else:
            session.add(User(**data))
        session.commit()

def save_plan(user_id: str, original_plan: str, nutrition_tip: str) -> None:
    with Session(engine) as session:
        session.add(Plan(user_id=user_id, original_plan=original_plan, nutrition_tip=nutrition_tip))
        session.commit()

def get_user(user_id: str) -> Optional[User]:
    with Session(engine) as session:
        return session.scalar(select(User).where(User.user_id == user_id))

def get_original_plan(user_id: str) -> Optional[Plan]:
    with Session(engine) as session:
        return session.scalars(select(Plan).where(Plan.user_id == user_id).order_by(Plan.id.desc())).first()

def update_plan(user_id: str, updated_plan: str, feedback: str) -> bool:
    with Session(engine) as session:
        plan = session.scalars(select(Plan).where(Plan.user_id == user_id).order_by(Plan.id.desc())).first()
        if not plan:
            return False
        plan.updated_plan = updated_plan
        plan.feedback = feedback
        session.commit()
        return True

def get_all_users() -> list[User]:
    with Session(engine) as session:
        return list(session.scalars(select(User).order_by(User.id)))

def get_all_plans() -> list[Plan]:
    with Session(engine) as session:
        return list(session.scalars(select(Plan).order_by(Plan.id)))
