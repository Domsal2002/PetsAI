from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.database import get_db
from app.models import User
import os

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in the .env file")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()


def create_access_token(data: dict):
    """
    Generate a JWT token with the given data payload.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})  # Add expiration claim
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_access_token(token: str):
    """
    Verify a JWT token and return the decoded payload.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT token containing the cognito_user_id.
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not form_data.password:  # Add password hashing validation here
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Generate token using cognito_user_id
    access_token = create_access_token(data={"sub": user.cognito_user_id})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/verify")
def verify_user(token: str = Depends(oauth2_scheme)):
    """
    Verify the provided JWT token.
    """
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return {"message": "Token is valid!"}


@router.get("/me")
def get_user_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Fetch the user's profile based on the JWT token.
    """
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    cognito_user_id = payload.get("sub")
    if not cognito_user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Fetch the user from the database
    user = db.query(User).filter(User.cognito_user_id == cognito_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"cognito_user_id": user.cognito_user_id, "email": user.email, "username": user.username}
