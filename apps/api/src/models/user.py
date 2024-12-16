from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: int
    login: str = Field(..., max_length=256)
    password: Optional[str] = None
    email: EmailStr
    t_created_at: Optional[datetime] = Field(default_factory=datetime.now)
    t_updated_at: Optional[datetime] = Field(default_factory=datetime.now)
    t_deleted: Optional[bool] = False
