from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: int


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserCreateAdmin(UserCreate):
    role: str = "user"


class UserRead(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ReviewBase(BaseModel):
    source: str = "manual"
    author: Optional[str] = None
    content: str


class ReviewCreate(ReviewBase):
    pass


class ReviewRead(ReviewBase):
    id: int
    sentiment: Optional[str] = None
    sentiment_score: Optional[float] = None
    key_entities: Optional[str] = None
    created_at: datetime
    analyzed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FeedbackFormBase(BaseModel):
    name: str
    question: Optional[str] = "Votre avis ?"

class FeedbackFormCreate(FeedbackFormBase):
    pass

class FeedbackFormRead(FeedbackFormBase):
    id: int
    uuid: str
    owner_id: int
    created_at: datetime


class DashboardSummary(BaseModel):
    total_reviews: int
    positive: int
    neutral: int
    negative: int
    latest_reviews: List[ReviewRead]


