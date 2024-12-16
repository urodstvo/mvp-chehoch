from fastapi import UploadFile
from pydantic import BaseModel, EmailStr
from typing import Optional

class UpdateOrganisationRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    inn: Optional[str] = None
    web_site: Optional[str] = None
    logo: Optional[UploadFile] = None 

    class Config:
        from_attributes = True  # Enable ORM mode if needed
