from pydantic import BaseModel, EmailStr
from typing import Optional

class UpdateOrganisationRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    inn: Optional[str] = None
    web_site: Optional[str] = None

    class Config:
        orm_mode = True  # Enable ORM mode if needed
