import sys
import os

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select
from app.database import get_session
from app.models import User
from app.security import get_password_hash

def create_admin(email, password, full_name="Admin"):
    # This script manually creates an admin user directly interacting with the DB
    # bypassing API limits (though API endpoint for admin creation exists now, we need a bootstrapping admin)
    
    # Actually, we can just use the internal database session
    # We need to ensure we have the environment setup correctly (dependencies installed)
    
    # We need to ensure we have the environment setup correctly (dependencies installed)
    
    with get_session() as session:
        statement = select(User).where(User.email == email)
        existing_user = session.exec(statement).first()
        
        if existing_user:
            print(f"User {email} already exists. update role to admin.")
            existing_user.role = "admin"
            existing_user.hashed_password = get_password_hash(password) # Update password too if you want, or handle differently
            session.add(existing_user)
            session.commit()
            session.refresh(existing_user)
            print(f"User {email} updated to admin.")
        else:
            print(f"Creating new admin user {email}")
            user = User(
                email=email,
                hashed_password=get_password_hash(password),
                full_name=full_name,
                role="admin",
                is_active=True
            )
            session.add(user)
            session.commit()
            print(f"Admin user {email} created successfully.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <email> <password> [full_name]")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    full_name = sys.argv[3] if len(sys.argv) > 3 else "Admin User"
    
    create_admin(email, password, full_name)
