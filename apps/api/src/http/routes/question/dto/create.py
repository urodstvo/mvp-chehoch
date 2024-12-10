from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile

class CreateQuestionRequest(BaseModel):
    survey_id: int
    type: int
