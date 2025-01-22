from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Pet, User
from app.schemas import PetCreate, PetResponse
from app.routes.auth import verify_access_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/pets", response_model=PetResponse)
def create_pet(pet: PetCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """
    Create a pet profile associated with the user making the request.
    """
    # Decode the JWT token and get the user ID
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    cognito_user_id = payload.get("sub")  # Extract the unique user ID from the JWT
    if not cognito_user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Verify the user exists
    user = db.query(User).filter(User.cognito_user_id == cognito_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create and save the pet in the database
    db_pet = Pet(
        pet_name=pet.pet_name,
        type=pet.type,
        cognito_user_id=cognito_user_id
    )
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)

    cognito_user_id = payload.get("sub")
    print(f"JWT sub (cognito_user_id): {cognito_user_id}")

    return db_pet


@router.get("/pets", response_model=list[PetResponse])
def get_user_pets(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Retrieve all pets associated with the user making the request.
    """
    # Decode and verify the JWT
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    cognito_user_id = payload.get("sub")
    if not cognito_user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Query for pets associated with the cognito_user_id
    pets = db.query(Pet).filter(Pet.cognito_user_id == cognito_user_id).all()
    if not pets:
        raise HTTPException(status_code=404, detail="No pets found for this user")

    return pets
