import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from sqlalchemy import create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
default_db = f"sqlite:///{BASE_DIR / 'fitbuddy.db'}"
DATABASE_URL = os.getenv("DATABASE_URL", default_db)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(unique=True, index=True)
    username: Mapped[str]
    age: Mapped[int]
    weight: Mapped[float]
    goal: Mapped[str]
    intensity: Mapped[str]


class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(index=True)
    original_plan: Mapped[str]
    updated_plan: Mapped[Optional[str]]
    nutrition_tip: Mapped[str]
    feedback: Mapped[Optional[str]]


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def save_user(user_id: str, username: str, age: int, weight: float, goal: str, intensity: str) -> User:
    with SessionLocal() as db:
        existing = db.scalar(select(User).where(User.user_id == user_id))
        if existing:
            existing.username = username
            existing.age = age
            existing.weight = weight
            existing.goal = goal
            existing.intensity = intensity
            db.commit()
            db.refresh(existing)
            return existing

        user = User(
            user_id=user_id,
            username=username,
            age=age,
            weight=weight,
            goal=goal,
            intensity=intensity,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user


def save_plan(user_id: str, original_plan: str, nutrition_tip: str) -> Plan:
    with SessionLocal() as db:
        plan = Plan(
            user_id=user_id,
            original_plan=original_plan,
            updated_plan=None,
            nutrition_tip=nutrition_tip,
            feedback=None,
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)
        return plan


def get_original_plan(user_id: str) -> Optional[Plan]:
    with SessionLocal() as db:
        return db.scalar(
            select(Plan)
            .where(Plan.user_id == user_id)
            .order_by(Plan.id.desc())
        )


def update_plan(user_id: str, updated_plan: str, feedback: str, nutrition_tip: str) -> Optional[Plan]:
    with SessionLocal() as db:
        plan = db.scalar(
            select(Plan)
            .where(Plan.user_id == user_id)
            .order_by(Plan.id.desc())
        )
        if not plan:
            return None

        plan.updated_plan = updated_plan
        plan.feedback = feedback
        plan.nutrition_tip = nutrition_tip
        db.commit()
        db.refresh(plan)
        return plan


def get_all_users():
    with SessionLocal() as db:
        return db.scalars(select(User).order_by(User.id.desc())).all()


def get_all_plans():
    with SessionLocal() as db:
        return db.scalars(select(Plan).order_by(Plan.id.desc())).all()
