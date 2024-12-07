from pydantic import BaseModel
from typing import List


class DeleteTagsFromSurveyRequest(BaseModel):
    survey_id: int
    tags: List[int]
