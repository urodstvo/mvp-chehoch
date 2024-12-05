from pydantic import BaseModel
from src.models import User, Profile

class UserWithProfile(BaseModel):
    user: User
    profile: Profile

    class Config:
        orm_mode = True  # Allow conversion from ORM models to Pydantic models