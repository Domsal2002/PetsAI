from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.aws_cognito import cognito_client, compute_secret_hash
from app.database import get_db
from app.models import User
from botocore.exceptions import ClientError
from app.aws_cognito import CLIENT_ID

from app.aws_cognito import authenticate_user, COGNITO_REGION, USER_POOL_ID, CLIENT_ID


router = APIRouter()

@router.post("/confirm-user")
def confirm_user(email: str, confirmation_code: str, db: Session = Depends(get_db)):
    """
    Confirm a user's account in AWS Cognito using the confirmation code
    and update the is_verified flag in the database.
    """
    try:
        # Call AWS Cognito to confirm the user
        response = cognito_client.confirm_sign_up(
            ClientId=CLIENT_ID,
            Username=email,
            ConfirmationCode=confirmation_code,
            SecretHash=compute_secret_hash(email),
        )

        # Fetch the user from the database
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found in the database")

        # Update the is_verified flag in the database
        user.is_verified = True
        db.commit()

        return {"message": "User successfully confirmed and verified in the database"}

    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        if error_code == "CodeMismatchException":
            raise HTTPException(status_code=400, detail="Invalid confirmation code")
        elif error_code == "ExpiredCodeException":
            raise HTTPException(status_code=400, detail="Confirmation code has expired")
        elif error_code == "UserNotFoundException":
            raise HTTPException(status_code=404, detail="User not found in Cognito")
        elif error_code == "NotAuthorizedException":
            raise HTTPException(status_code=400, detail="User is already confirmed")
        else:
            raise HTTPException(
                status_code=500, detail=f"Failed to confirm user: {e.response['Error']['Message']}"
            )

@router.post("/resend-confirmation-code")
def resend_confirmation_code(email: str):
    """
    Resend the confirmation code to the user's email.
    """
    try:
        # Call AWS Cognito to resend the confirmation code
        response = cognito_client.resend_confirmation_code(
            ClientId=CLIENT_ID,
            Username=email,
            SecretHash=compute_secret_hash(email),
        )
        return {"message": "Confirmation code resent successfully"}
    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        if error_code == "UserNotFoundException":
            raise HTTPException(status_code=404, detail="User not found")
        elif error_code == "InvalidParameterException":
            raise HTTPException(
                status_code=400, detail="User is already confirmed or invalid email"
            )
        else:
            raise HTTPException(
                status_code=500, detail=f"Failed to resend confirmation code: {e.response['Error']['Message']}"
            )