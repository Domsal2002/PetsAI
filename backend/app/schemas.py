from pydantic import BaseModel, EmailStr
from typing import Optional

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    cognito_user_id: str
    email: EmailStr
    is_verified: bool

    class Config:
        from_attributes = True

# Pet Schemas
class PetCreate(BaseModel):
    pet_name: str
    type: Optional[str] = None

class PetResponse(BaseModel):
    pet_id: int
    pet_name: str
    type: Optional[str]
    
    class Config:
        from_attributes = True


# this is an absolutely useless push so that I get dopamine from filling the github contributions graph