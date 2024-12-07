from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    login: str
    password: str
    email: EmailStr