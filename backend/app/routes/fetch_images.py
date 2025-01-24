from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Image, User
from app.routes.auth import get_current_user
from app.aws_s3 import generate_presigned_url
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()

limiter = Limiter(key_func=get_remote_address)

@router.get("/sample-images")
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
