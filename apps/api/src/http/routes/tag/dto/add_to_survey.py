from pydantic import BaseModel
from typing import List

class AddTagsToSurveyRequest(BaseModel):
    tags: List[int]
