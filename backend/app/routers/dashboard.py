from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..dependencies import get_current_user, get_db
from ..models import User
from ..schemas import DashboardSummary
from ..services import get_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardSummary)
def get_dashboard(
    session: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> DashboardSummary:
    sentiment_counts, latest_reviews = get_dashboard_summary(session, user.id)
    return DashboardSummary(
        total_reviews=sentiment_counts["total"],
        positive=sentiment_counts["positive"],
        neutral=sentiment_counts["neutral"],
        negative=sentiment_counts["negative"],
        latest_reviews=latest_reviews,
    )


