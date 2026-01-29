from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class FeedbackForm(SQLModel, table=True):
    __tablename__ = "feedback_forms"

    id: Optional[int] = Field(default=None, primary_key=True)
    uuid: str = Field(index=True, unique=True)
    name: str
    question: Optional[str] = Field(default="Votre avis ?")
    owner_id: int = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    owner: "User" = Relationship(back_populates="feedback_forms")
    reviews: List["Review"] = Relationship(back_populates="feedback_form")


class Review(SQLModel, table=True):
    __tablename__ = "reviews"

    id: Optional[int] = Field(default=None, primary_key=True)
    source: str = Field(default="manual", max_length=50)
    author: Optional[str] = Field(default=None, max_length=120)
    content: str
    sentiment: Optional[str] = Field(
        default=None, max_length=16, description="positive|neutral|negative"
    )
    sentiment_score: Optional[float] = None
    key_entities: Optional[str] = Field(
        default=None, description="comma separated key entities"
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    analyzed_at: Optional[datetime] = None
    owner_id: Optional[int] = Field(default=None, foreign_key="users.id")
    form_id: Optional[int] = Field(default=None, foreign_key="feedback_forms.id")
    
    owner: Optional["User"] = Relationship(back_populates="reviews")
    feedback_form: Optional[FeedbackForm] = Relationship(back_populates="reviews")


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    hashed_password: str
    role: str = Field(default="user")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    reviews: List[Review] = Relationship(back_populates="owner")
    feedback_forms: List[FeedbackForm] = Relationship(back_populates="owner")


