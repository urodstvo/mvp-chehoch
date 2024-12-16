from pydantic import BaseModel
from src.models import User, Profile

class UserWithProfile(BaseModel):
    user: User
    profile: Profile

    class Config:
        from_attributes = True  # Allow conversion from ORM models to Pydantic models