from sqlalchemy import Column, String, Boolean, Integer, TIMESTAMP, ForeignKey, Text
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    cognito_user_id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

class Pet(Base):
    __tablename__ = "pets"
    pet_id = Column(Integer, primary_key=True, index=True)
    cognito_user_id = Column(String, ForeignKey("users.cognito_user_id"), nullable=False)
    pet_name = Column(String, nullable=False)
    type = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

class Image(Base):
    __tablename__ = "images"
    image_id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.pet_id"), nullable=False)
    cognito_user_id = Column(String(255), ForeignKey("users.cognito_user_id"), nullable=False)
    model_id = Column(Integer, ForeignKey("ai_models.model_id"), nullable=True)
    image_type = Column(String(50), nullable=False)
    s3_key = Column(String(255), nullable=False)
    prompt = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

class AIModel(Base):
    __tablename__ = "ai_models"
    model_id = Column(Integer, primary_key=True, index=True)
    cognito_user_id = Column(String, ForeignKey("users.cognito_user_id"), nullable=False)
    pet_id = Column(Integer, ForeignKey("pets.pet_id"), nullable=False)
    replicate_model_id = Column(String(255), nullable=False)
    model_uri = Column(Text)
    final_model_name = Column(Text)
    status = Column(String(50), default="pending", nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)
    trigger_word = Column(String, nullable=False)
