from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# Pydantic model for UpdateUserRequest
class UpdateUserRequest(BaseModel):
    login: Optional[str] = None
    email: Optional[EmailStr] = None
    profession: Optional[str] = None
    birth_date: Optional[datetime] = None
    marital_status: Optional[str] = None
    education_level: Optional[str] = None

    class Config:
        orm_mode = True  # Allows compatibility with ORM models (if using ORM)
