from sqlmodel import Session, select
from app.models import User
from app.database import engine
from app.security import get_password_hash, verify_password

def reset_password(email, new_password):
    with Session(engine) as session:
        print(f"Searching for user: {email}")
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user:
            print("User not found.")
            return

        print(f"User found (ID: {user.id}). Updating password...")
        new_hash = get_password_hash(new_password)
        user.hashed_password = new_hash
        session.add(user)
        session.commit()
        session.refresh(user)
        print("Password updated.")

        # Verify immediately
        if verify_password(new_password, user.hashed_password):
            print("Verification: SUCCESS")
        else:
            print("Verification: FAILED (Something is wrong with hashing lib)")

if __name__ == "__main__":
    email = "laajimiyosr@gmail.com"
    password = "o06n76dsglrmszuvcwxy?"
    reset_password(email, password)
