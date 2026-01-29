from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..dependencies import get_db, require_admin
from ..models import User
from ..schemas import UserCreateAdmin, UserRead
from ..security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=List[UserRead])
def read_users(
    session: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_admin)],
) -> List[User]:
    users = session.exec(select(User)).all()
    return users


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreateAdmin,
    session: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_admin)],
) -> User:
    statement = select(User).where(User.email == user_in.email)
    existing = session.exec(statement).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
    )
    try:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    session: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_admin)],
) -> None:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting yourself
    if user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    session.delete(user)
    session.commit()
