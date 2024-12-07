from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class Profile(BaseModel):
    user_id: int
    profession: Optional[str] = Field(None, max_length=128)
    birth_date: Optional[date] = None
    education_level: Optional[str] = Field(None, max_length=128)
    marital_status: Optional[str] = Field(None, max_length=1)
    avatar: Optional[int] = None