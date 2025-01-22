from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse
from app.aws_cognito import register_user, delete_cognito_user
from botocore.exceptions import ClientError

router = APIRouter()

@router.post("/createuser", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user by registering them with AWS Cognito and saving
    the user metadata in the PostgreSQL database.
    """
    try:
        # Register user with AWS Cognito
        cognito_response = register_user(user.email, user.username, user.password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Add user to the database
    db_user = User(
        cognito_user_id=cognito_response["UserSub"],
        email=user.email,
        username=user.username,
        is_verified=False,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{cognito_user_id}", status_code=204)
def delete_user(cognito_user_id: str, db: Session = Depends(get_db)):
    """
    Delete a user from AWS Cognito and PostgreSQL.
    """
    # Fetch the user from the database
    db_user = db.query(User).filter(User.cognito_user_id == cognito_user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete the user from AWS Cognito
    try:
        delete_cognito_user(cognito_user_id)
    except ClientError as e:
        if e.response['Error']['Code'] == 'UserNotFoundException':
            raise HTTPException(status_code=404, detail="User not found in Cognito")
        raise HTTPException(status_code=500, detail="Failed to delete user from Cognito")

    # Delete the user from PostgreSQL
    db.delete(db_user)
    db.commit()

    return {"message": "User successfully deleted"}
