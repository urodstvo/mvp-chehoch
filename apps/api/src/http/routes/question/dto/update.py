from fastapi import Form, UploadFile
from pydantic import BaseModel
from typing import Optional

class UpdateQuestionRequest(BaseModel):
    content: Optional[str] = Form(None)
    type: Optional[int] = Form(None)
    image: Optional[UploadFile] = Form(None)
