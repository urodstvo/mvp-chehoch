from pydantic import BaseModel, EmailStr
from typing import Optional

from fastapi import UploadFile

class CreateOrganisationRequest(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    inn: Optional[str] = None
    web_site: Optional[str] = None
    logo: Optional[UploadFile] = None 

    class Config:
        from_attributes = True  # Enable ORM mode if you need to use it with ORM models
