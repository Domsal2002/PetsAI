# app/routes/training.py

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal  # SessionLocal for background tasks
from app.models import User, Pet, Image, AIModel
from app.routes.auth import get_current_user
from app.aws_s3 import upload_file_to_s3  # your S3 helper function
import zipfile, uuid, os, io, secrets
from PIL import Image as PILImage
import replicate

router = APIRouter()

@router.post("/initiate-training")
async def initiate_training(
    background_tasks: BackgroundTasks,
    pet_id: int = Form(...),
    images: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Verify that the pet belongs to the current user.
    pet = db.query(Pet).filter(
        Pet.pet_id == pet_id, 
        Pet.cognito_user_id == current_user.cognito_user_id
    ).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    # 2. Process and convert each uploaded image.
    temp_dir = f"/tmp/{uuid.uuid4()}"
    os.makedirs(temp_dir, exist_ok=True)
    processed_image_paths = []
    
    for file in images:
        contents = await file.read()
        try:
            image = PILImage.open(io.BytesIO(contents))
        except Exception:
            continue  # Skip invalid image files.
        
        # Convert the image to a standard format (WEBP in this example).
        standard_filename = f"{uuid.uuid4()}.webp"
        image_path = os.path.join(temp_dir, standard_filename)
        if image.mode != "RGB":
            image = image.convert("RGB")
        image.save(image_path, "WEBP")
        processed_image_paths.append(image_path)
        
        # 3. Upload the converted image to S3.
        s3_key = f"uploaded/{current_user.cognito_user_id}/{standard_filename}"
        upload_file_to_s3(image_path, s3_key)
        
        # Save image metadata in the database.
        new_image = Image(
            pet_id=pet.pet_id,  # Use the pet's ID.
            cognito_user_id=current_user.cognito_user_id,
            image_type="uploaded",
            s3_key=s3_key
        )
        db.add(new_image)
        db.commit()
    
    if not processed_image_paths:
        raise HTTPException(status_code=400, detail="No valid images provided")
    
    # 4. Zip all processed images.
    zip_filename = f"{uuid.uuid4()}.zip"
    zip_filepath = os.path.join("/tmp", zip_filename)
    with zipfile.ZipFile(zip_filepath, "w") as zipf:
        for image_path in processed_image_paths:
            zipf.write(image_path, arcname=os.path.basename(image_path))
    
    # Clean up the temporary image files and directory.
    for image_path in processed_image_paths:
        os.remove(image_path)
    os.rmdir(temp_dir)
    
    # 5. Generate a random trigger word.
    trigger_word = secrets.token_hex(4)  # e.g., "9f1a2b3c"
    
    # 6. Build the autocaption prefix (e.g., "Whiskers the cat").
    pet_type = pet.type if pet.type else "pet"
    autocaption_prefix = f"{pet.pet_name} the {pet_type}"
    
    # 7. Launch a background task to create the model and initiate training.
    background_tasks.add_task(
        run_replicate_training,
        zip_filepath,
        pet.pet_id,
        current_user.cognito_user_id,
        trigger_word,
        autocaption_prefix
    )
    
    # Immediately return a response.
    return {"message": "Training initiated", "trigger_word": trigger_word}


def run_replicate_training(zip_filepath: str, pet_id: int, cognito_user_id: str, trigger_word: str, autocaption_prefix: str):
    """
    This background task creates a new model on Replicate (which will serve as the destination for training)
    and then initiates training using the ostris/flux-dev-lora-trainer model.
    """
    # Open a new DB session for this background task.
    db = SessionLocal()
    try:
        # Create a new model record on Replicate to hold the training result.
        model_owner = "domsal2002"  # Your Replicate owner name.
        model_name = f"pet-{pet_id}-{uuid.uuid4().hex[:6]}"
        destination = f"{model_owner}/{model_name}"
        
        created_model = replicate.models.create(
            owner=model_owner,
            name=model_name,
            visibility="private",  # or "public" if desired
            hardware="gpu-t4",     # hardware configuration (may be adjusted by Replicate)
            description="Training model for pet images"
        )
        print(f"Model created: {destination}")
        
        # Build the version string for the training model.
        version_str = "ostris/flux-dev-lora-trainer:b6af14222e6bd9be257cbc1ea4afda3cd0503e1133083b9d1de0364d8568e6ef"
        
        # Initiate training using the created model as the destination.
        with open(zip_filepath, "rb") as zip_file:
            training = replicate.trainings.create(
                version=version_str,
                input={
                    "input_images": zip_file,
                    "steps": 100,
                    "trigger_word": trigger_word,
                    "lora_rank": 16,
                    "autocaption_prefix": autocaption_prefix,
                    "autocaption_suffix": "",
                    "autocaption": True,
                    "learning_rate": 0.0004,
                },
                destination=destination
            )
        print(f"Training started: {training.status}")
        print(f"Training URL: https://replicate.com/p/{training.id}")
        
        # Record the training job in the AIModel table.
        new_ai_model = AIModel(
            cognito_user_id=cognito_user_id,
            pet_id=pet_id,
            replicate_model_id=training.id,
            status=training.status
        )
        db.add(new_ai_model)
        db.commit()
    except Exception as e:
        print(f"Error initiating training: {e}")
    finally:
        db.close()
        if os.path.exists(zip_filepath):
            os.remove(zip_filepath)
