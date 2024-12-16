from pydantic import BaseModel
from typing import List

class AddTagsToUserRequest(BaseModel):
    tags: List[int]
