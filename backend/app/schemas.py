from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str  # Not stored here, but sent to AWS Cognito

class UserResponse(BaseModel):
    cognito_user_id: str
    email: EmailStr
    username: str
    is_verified: bool

    class Config:
        orm_mode = True
