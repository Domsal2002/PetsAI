from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.aws_cognito import authenticate_user, COGNITO_REGION, USER_POOL_ID, CLIENT_ID
from slowapi import Limiter
from slowapi.util import get_remote_address
from jose import jwt
import requests
import threading
from cachetools import TTLCache
import os

# Initialize the APIRouter
router = APIRouter()

# OAuth2 scheme for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# JWKS URL for fetching Cognito public keys
JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"

# Cache for JWKS with a TTL of 1 hour (3600 seconds)
jwks_cache = TTLCache(maxsize=1, ttl=3600)
jwks_lock = threading.Lock()  # Correctly initialize the threading.Lock object

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "RS256"

# Access the rate limiter from the app state
limiter = Limiter(key_func=get_remote_address)


def get_jwks():
    """
    Retrieve the JWKS from the cache or fetch it if expired.
    """
    with jwks_lock:  # Ensure thread safety
        if "jwks" not in jwks_cache:
            # Fetch the JWKS from AWS Cognito
            response = requests.get(JWKS_URL)
            if response.status_code != 200:
                raise Exception("Failed to fetch JWKS from Cognito")
            jwks_cache["jwks"] = response.json()
        return jwks_cache["jwks"]


def verify_access_token(token: str):
    """
    Verify and decode the JWT token using Cognito public keys (JWKS).
    """
    try:
        # Fetch the JWKS (cached or refreshed)
        jwks = get_jwks()

        # Decode the token using the JWKS
        payload = jwt.decode(
            token,
            jwks,  # JWKS fetched dynamically
            algorithms=["RS256"],
            audience=CLIENT_ID,  # Match the audience claim
            issuer=f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}",
        )
        return payload
    except jwt.JWTError as e:
        raise Exception(f"Invalid Cognito token: {str(e)}")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    """
    Decode and verify the JWT, and retrieve the current user from the database.
    """
    # Decode and verify the JWT
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Extract the Cognito user ID (sub) from the token
    cognito_user_id = payload.get("sub")
    if not cognito_user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Verify the user exists in the database
    user = db.query(User).filter(User.cognito_user_id == cognito_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Return the user object
    return user


@router.post("/login")
@limiter.limit("50/minute")  # Apply rate limiting to this endpoint
def login(
    request: Request,  # Add the request parameter for rate limiting
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate a user through AWS Cognito and return their tokens.
    """
    try:
        # Authenticate the user via AWS Cognito
        auth_result = authenticate_user(form_data.username, form_data.password)

        # Extract Cognito user ID (sub) from the returned ID token
        id_token = auth_result["IdToken"]
        access_token = auth_result["AccessToken"]
        payload = verify_access_token(id_token)

        if not payload:
            raise HTTPException(status_code=401, detail="Invalid Cognito token")
        cognito_user_id = payload.get("sub")
        if not cognito_user_id:
            raise HTTPException(status_code=401, detail="Cognito user ID not found in token")

        # Check if the user exists in the database
        user = db.query(User).filter(User.cognito_user_id == cognito_user_id).first()

        # Add the user to the database if not already present
        if not user:
            user = User(
                cognito_user_id=cognito_user_id,
                email=payload.get("email"),
                username=payload.get("preferred_username"),
            )
            db.add(user)
            db.commit()

        return {
            "id_token": id_token,
            "access_token": access_token,
            "token_type": "Bearer",
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")
