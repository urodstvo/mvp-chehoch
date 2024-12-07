from typing import List
from pydantic import BaseModel

from src.models import Survey, Tag


class GetSurveyResponse(BaseModel):
    survey: Survey 
    tags: List[Tag]

    class Config:
        from_attributes = True