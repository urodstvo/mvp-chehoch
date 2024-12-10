from pydantic import BaseModel, EmailStr
from typing import Optional

from fastapi import Form, UploadFile

class CreateOrganisationRequest(BaseModel):
    name: str = Form(...)
    email: Optional[EmailStr] = Form(None)
    phone: Optional[str] = Form(None)
    address: Optional[str] = Form(None)
    inn: Optional[str] = Form(None)
    web_site: Optional[str] = Form(None)
    image: Optional[UploadFile] = Form(None) 

