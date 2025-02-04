from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Image, User, Pet
from app.routes.auth import get_current_user
from app.aws_s3 import generate_presigned_url
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()

limiter = Limiter(key_func=get_remote_address)

#Route that fetches the images generated with the sample model for a specific user
@router.get("/sample-generated-images")
@limiter.limit("5/minute")
def get_sample_images(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        images = db.query(Image).filter(
            Image.pet_id == 0,
            Image.cognito_user_id == current_user.cognito_user_id
        ).all()

        image_metadata = [
            {
                "image_id": image.image_id,
                "prompt": image.prompt,
                "url": generate_presigned_url(image.s3_key)
            }
            for image in images
        ]

        return {"images": image_metadata}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch images: {str(e)}")


@router.get("/pets/{pet_id}/images")
@limiter.limit("5/minute")
def get_pet_images(
    request: Request,
    pet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns presigned URLs for images belonging to the *current user* for a specific pet_id.
    Checks pet ownership first, then fetches images.
    """

    # Check if the pet exists
    pet = db.query(Pet).filter(Pet.pet_id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    # Verify Ownership
    if pet.cognito_user_id != current_user.cognito_user_id:
        raise HTTPException(status_code=403, detail="User does not own this pet")
    
    #  Fetch images for the pet
    images = db.query(Image).filter(
        Image.pet_id == pet_id,
        Image.cognito_user_id == current_user.cognito_user_id
    ).all()

    # Generate presigned URLs
    image_metadata = []
    for image in images:
        image_metadata.append({
            "image_id": image.image_id,
            "prompt": image.prompt,
            "url": generate_presigned_url(image.s3_key)
        })
    
    return {"images": image_metadata}
