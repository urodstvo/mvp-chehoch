from pydantic import BaseModel
from typing import List


class DeleteTagsFromSurveyRequest(BaseModel):
    tags: List[int]
