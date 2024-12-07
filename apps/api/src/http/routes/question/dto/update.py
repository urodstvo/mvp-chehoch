from fastapi import UploadFile
from pydantic import BaseModel
from typing import Optional

class UpdateQuestionRequest(BaseModel):
    content: Optional[str] = None
    type: Optional[int] = None
    image: Optional[UploadFile] = None
