from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Pydantic model for UpdateUserRequest
class UpdateUserRequest(BaseModel):
    login: Optional[str] = None
    email: Optional[EmailStr] = None
    proffession: Optional[str] = None
    birth_date: Optional[datetime] = None
    marital_status: Optional[str] = None
    education_level: Optional[str] = None

    class Config:
        from_attributes = True  # Allows compatibility with ORM models (if using ORM)
