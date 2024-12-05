from pydantic import BaseModel
from typing import List

class DeleteTagsFromUserRequest(BaseModel):
    tags: List[int]
