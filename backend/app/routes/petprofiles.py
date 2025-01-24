from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Pet, User
from app.schemas import PetCreate, PetResponse
from app.routes.auth import get_current_user
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()

#Access the rate limiter from the app state
limiter = Limiter(key_func=get_remote_address)

@router.post("/pets", response_model=PetResponse)
@limiter.limit("50/minute")
def create_pet(
    request: Request,
    pet: PetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # Verify the user
):
    """
    Create a pet profile associated with the user making the request.
    """
    # Create and save the pet in the database
    db_pet = Pet(
        pet_name=pet.pet_name,
        type=pet.type,
        cognito_user_id=current_user.cognito_user_id  # Associate the pet with the user
    )
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)

    return db_pet

@router.get("/pets", response_model=list[PetResponse])
@limiter.limit("50/minute")
def get_user_pets(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # Verify the user
):
    """
    Retrieve all pets associated with the user making the request.
    """
    # Query for pets associated with the current user
    pets = db.query(Pet).filter(Pet.cognito_user_id == current_user.cognito_user_id).all()
    if not pets:
        raise HTTPException(status_code=404, detail="No pets found for this user")

    return pets



