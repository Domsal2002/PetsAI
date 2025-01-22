from pydantic import BaseModel, EmailStr
from typing import Optional

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserResponse(BaseModel):
    cognito_user_id: str
    email: EmailStr
    username: str
    is_verified: bool

    class Config:
        orm_mode = True

# Pet Schemas
class PetCreate(BaseModel):
    cognito_user_id: str
    pet_name: str
    type: Optional[str] = None

class PetResponse(BaseModel):
    pet_id: int
    cognito_user_id: str
    pet_name: str
    type: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True
