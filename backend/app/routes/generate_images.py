from fastapi import APIRouter, Depends, HTTPException, Request
import uuid
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Image
from app.routes.auth import get_current_user
from app.aws_s3 import upload_file_to_s3, generate_presigned_url
from pydantic import BaseModel
import replicate
import requests
import os
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()

limiter = Limiter(key_func=get_remote_address)

class GenerateImageRequest(BaseModel):
    prompt: str

@router.post("/generate-image")
@limiter.limit("5/minute")
def generate_image(
    request: Request,
    body: GenerateImageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_verified:
        raise HTTPException(status_code=403, detail="User is not verified")

    try:
        # Step 1: Generate the image using Replicate
        input = {"width": 1024, "height": 1024, "prompt": body.prompt}
        output = replicate.run(
            "domsal2002/wskrs-trigger-word-change-2:a1147491becf5114792c56f24dd6b27ef17213607d2bec5520887f338f79cd0b",
            input=input,
        )

        # Step 2: Download the generated image
        image_url = output[0]
        response = requests.get(image_url)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to download the generated image")

        unique_file_name = f"{uuid.uuid4()}.webp"
        file_path = f"/tmp/{unique_file_name}"

        with open(file_path, "wb") as file:
            file.write(response.content)

        # Step 3: Upload the image to S3
        s3_key = f"generated/{current_user.cognito_user_id}/{unique_file_name}"
        s3_uri = upload_file_to_s3(file_path, s3_key)

        # Generate a presigned URL for accessing the image
        presigned_url = generate_presigned_url(s3_key)

        # Step 4: Save metadata in the database
        new_image = Image(
            pet_id=0,
            cognito_user_id=current_user.cognito_user_id,
            image_type="generated",
            s3_key=s3_key,
            prompt=body.prompt,
        )
        db.add(new_image)
        db.commit()

        os.remove(file_path)

        return {"message": "Image generated and saved successfully", "url": presigned_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")
