from sqlmodel import Session, select
from app.models import User
from app.database import engine
from app.security import verify_password, get_password_hash

def test_login(email, password):
    with Session(engine) as session:
        print(f"Searching for user: {email}")
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user:
            print(f"User {email} NOT FOUND in database.")
            return

        print(f"User found. ID: {user.id}")
        
        print("Verifying password...")
        is_valid = verify_password(password, user.hashed_password)
        if is_valid:
            print("Password verification SUCCESSFUL.")
        else:
            print("Password verification FAILED.")
            # Debug info (careful with logs in production, but okay here for local debug)
            print(f"Stored hash start: {user.hashed_password[:10]}...")

if __name__ == "__main__":
    # Credentials from user report
    email = "laajimiyosr@gmail.com"
    password = "o06n76dsglrmszuvcwxy?" 
    test_login(email, password)
