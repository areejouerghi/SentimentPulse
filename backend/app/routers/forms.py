from typing import Annotated, List
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..dependencies import get_current_user, get_db
from ..models import FeedbackForm, Review, User
from ..schemas import FeedbackFormCreate, FeedbackFormRead, ReviewCreate, ReviewRead, DashboardSummary
from ..services import analyze_review, get_form_stats

router = APIRouter(tags=["forms"])

# === User Endpoints (Auth Required) ===

@router.post("/forms", response_model=FeedbackFormRead, status_code=status.HTTP_201_CREATED)
def create_form(
    form_in: FeedbackFormCreate,
    session: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> FeedbackForm:
    form = FeedbackForm(
        name=form_in.name,
        question=form_in.question,
        uuid=str(uuid.uuid4()),
        owner_id=user.id,
    )
    session.add(form)
    session.commit()
    session.refresh(form)
    return form


@router.get("/forms", response_model=List[FeedbackFormRead])
def list_forms(
    session: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> List[FeedbackForm]:
    statement = select(FeedbackForm).where(FeedbackForm.owner_id == user.id)
    return session.exec(statement).all()


@router.delete("/forms/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_form(
    form_id: int,
    session: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> None:
    form = session.get(FeedbackForm, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    if form.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this form")

    session.delete(form)
    session.commit()


@router.get("/forms/{form_id}/stats", response_model=DashboardSummary)
def get_form_statistics(
    form_id: int,
    session: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> DashboardSummary:
    form = session.get(FeedbackForm, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    if form.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    counts, latest = get_form_stats(session, form_id, limit=50)
    
    return DashboardSummary(
        total_reviews=counts["total"],
        positive=counts["positive"],
        neutral=counts["neutral"],
        negative=counts["negative"],
        latest_reviews=latest
    )


# === Public Endpoints (No Auth Required) ===

@router.get("/public/{form_uuid}", response_model=FeedbackFormRead)
def get_public_form(
    form_uuid: str,
    session: Annotated[Session, Depends(get_db)],
) -> FeedbackForm:
    statement = select(FeedbackForm).where(FeedbackForm.uuid == form_uuid)
    form = session.exec(statement).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form


@router.post("/public/{form_uuid}", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
def submit_public_review(
    form_uuid: str,
    review_in: ReviewCreate,
    session: Annotated[Session, Depends(get_db)],
) -> Review:
    statement = select(FeedbackForm).where(FeedbackForm.uuid == form_uuid)
    form = session.exec(statement).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    review = Review(
        source="public_form",
        author=review_in.author or "Anonymous",
        content=review_in.content,
        owner_id=form.owner_id, # Link query to form owner
        form_id=form.id
    )
    analyze_review(review)
    session.add(review)
    session.commit()
    session.refresh(review)
    return review
