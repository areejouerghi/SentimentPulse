from typing import Annotated, List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlmodel import Session, select

from ..dependencies import get_current_user, get_db
from ..models import Review, User
from ..schemas import ReviewCreate, ReviewRead
from ..services import analyze_review, bulk_import_reviews

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
def create_review(
    review_in: ReviewCreate,
    session: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> Review:
    review = Review(
        source=review_in.source,
        author=review_in.author,
        content=review_in.content,
        owner_id=user.id,
    )
    analyze_review(review)
    session.add(review)
    session.commit()
    session.refresh(review)
    return review


@router.post("/import", status_code=status.HTTP_201_CREATED)
async def import_reviews(
    session: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
    file: UploadFile = File(...),
) -> dict:
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    content = (await file.read()).decode("utf-8")
    try:
        imported = bulk_import_reviews(session, content, user.id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"imported": imported}


@router.get("/", response_model=List[ReviewRead])
def list_reviews(
    session: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> List[Review]:
    statement = select(Review).where(Review.owner_id == user.id).order_by(
        Review.created_at.desc()
    )
    return session.exec(statement).all()

