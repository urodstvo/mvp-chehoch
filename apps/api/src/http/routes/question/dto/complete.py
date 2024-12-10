from pydantic import BaseModel
from typing import Optional, List

class ChoosenAnswer(BaseModel):
    answer_variant_id: Optional[int] = None
    priority: Optional[int] = None
    content: str


class CompleteQuestionRequest(BaseModel):
    answers: List[ChoosenAnswer]  # List of ChoosenAnswer objects