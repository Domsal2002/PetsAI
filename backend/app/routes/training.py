from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal  # SessionLocal for background tasks
from app.models import User, Pet, Image, AIModel
from app.routes.auth import get_current_user
from app.aws_s3 import upload_file_to_s3  # your S3 helper function
import zipfile, uuid, os, io, secrets, time
from PIL import Image as PILImage
from pillow_heif import register_heif_opener
import replicate

# Register HEIC support
register_heif_opener()

router = APIRouter()

@router.post("/initiate-training")
async def initiate_training(
    background_tasks: BackgroundTasks,
    pet_id: int = Form(...),
    images: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print(f"total images: {len(images)}")
    # Step 1: Verify pet ownership
    pet = verify_pet_owner(pet_id, current_user, db)
    
    # Step 2: Process and upload images
    processed_image_paths = process_and_upload_images(images, pet, current_user, db)
    
    # Step 3: Zip processed images
    zip_filepath = zip_processed_images(processed_image_paths)
    
    # Step 4: Generate a random trigger word (simplified for example)
    trigger_word = secrets.token_hex(4)
    
    # Step 5: Build autocaption prefix
    pet_type = pet.type if pet.type else "pet"
    autocaption_prefix = f"{pet_type}"
    
    # Step 6: Launch background task for training
    background_tasks.add_task(
        run_replicate_training,
        zip_filepath,
        pet.pet_id,
        current_user.cognito_user_id,
        trigger_word,  # Pass trigger_word directly
        autocaption_prefix
    )
    
    # Return immediate response with the count of processed images
    return {"message": f"Training initiated for {len(processed_image_paths)} images", "trigger_word": trigger_word}

def verify_pet_owner(pet_id: int, current_user: User, db: Session) -> Pet:
    """
    Verify that the pet belongs to the current user.
    """
    pet = db.query(Pet).filter(
        Pet.pet_id == pet_id, 
        Pet.cognito_user_id == current_user.cognito_user_id
    ).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet

def process_and_upload_images(images: list[UploadFile], pet: Pet, current_user: User, db: Session) -> list[str]:
    """
    Process and upload each uploaded image, returning a list of processed image paths.
    """
    temp_dir = f"/tmp/{uuid.uuid4()}"
    os.makedirs(temp_dir, exist_ok=True)
    processed_image_paths = []
    
    for file in images:
        try:
            file.file.seek(0)
            contents = file.file.read()
            image = PILImage.open(io.BytesIO(contents))
            
            # Convert the image to a standard format (JPEG in this example)
            standard_filename = f"{uuid.uuid4()}.jpg"
            image_path = os.path.join(temp_dir, standard_filename)
            if image.mode != "RGB":
                image = image.convert("RGB")
            image.save(image_path, "JPEG")
            processed_image_paths.append(image_path)
            
            # Upload the converted image to S3
            s3_key = f"uploaded/{current_user.cognito_user_id}/{standard_filename}"
            upload_file_to_s3(image_path, s3_key)
            
            # Save image metadata in the database
            new_image = Image(
                pet_id=pet.pet_id,
                cognito_user_id=current_user.cognito_user_id,
                image_type="uploaded",
                s3_key=s3_key
            )
            db.add(new_image)
            db.commit()
            
        except Exception as e:
            print(f"Error processing image: {e}")
            continue
        finally:
            file.file.close()
    
    return processed_image_paths

def zip_processed_images(processed_image_paths: list[str]) -> str:
    """
    Zip all processed images and return the zip file path.
    """
    zip_filename = f"{uuid.uuid4()}.zip"
    zip_filepath = os.path.join("/tmp", zip_filename)
    with zipfile.ZipFile(zip_filepath, "w") as zipf:
        for image_path in processed_image_paths:
            zipf.write(image_path, arcname=os.path.basename(image_path))
    
    return zip_filepath

def run_replicate_training(zip_filepath: str, pet_id: int, cognito_user_id: str, trigger_word: str, autocaption_prefix: str):
    """
    Background task to create a new model on Replicate, initiate training,
    poll until training completion, and then store the final model URI.
    """
    db = SessionLocal()
    try:
        model_owner = "domsal2002"
        # Generate a temporary model name; Replicate may adjust this
        temp_model_name = f"pet-{pet_id}-{uuid.uuid4().hex[:6]}"
        
        # Create a new model record on Replicate.
        created_model = replicate.models.create(
            owner=model_owner,
            name=temp_model_name,
            visibility="private",
            hardware="gpu-t4",
            description="Training model for pet images"
        )
        # Use the actual name returned by Replicate (e.g. "pet-50-201ebe")
        actual_model_name = created_model.name  
        actual_destination = f"{model_owner}/{actual_model_name}"
        print(f"Model created: {actual_destination}")
        
        # Build the version string for the training model (your trainer version)
        version_str = "ostris/flux-dev-lora-trainer:b6af14222e6bd9be257cbc1ea4afda3cd0503e1133083b9d1de0364d8568e6ef"
        
        # Initiate training using the created model as destination
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
                destination=actual_destination
            )
        
        print("Training initiated. Waiting for completion...")
        # Poll the training endpoint until status is not "starting" or "processing"
        final_training = replicate.trainings.get(training.id)
        while final_training.status in ["starting", "processing"]:
            time.sleep(5)
            final_training = replicate.trainings.get(training.id)
        
        print("Final training response:")
        print(final_training)
        print(f"Training ended with status: {final_training.status}")
        
        if final_training.status != "succeeded":
            raise Exception(f"Training did not succeed: {final_training.status}")
        
        # IMPORTANT: Extract the correct model URI from the training output field.
        # The output field's "version" key contains the final, correct URI.
        if not final_training.output or "version" not in final_training.output:
            raise Exception("Final training response does not contain output.version")
        model_uri = final_training.output["version"]
        print(f"Constructed Model URI: {model_uri}")
        
        # Save the training job in the AIModel table including the model_uri field.
        new_ai_model = AIModel(
            cognito_user_id=cognito_user_id,
            pet_id=pet_id,
            replicate_model_id=training.id,  # training job ID
            model_uri=model_uri,             # the final model URI from the output
            status=final_training.status,
            trigger_word=trigger_word
        )
        db.add(new_ai_model)
        db.commit()
    except Exception as e:
        print(f"Error initiating training: {e}")
    finally:
        db.close()
        if os.path.exists(zip_filepath):
            os.remove(zip_filepath)
