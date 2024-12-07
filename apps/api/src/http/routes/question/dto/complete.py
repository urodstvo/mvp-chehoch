from pydantic import BaseModel
from typing import Optional, List

class ChoosenAnswer(BaseModel):
    answer_variant_id: int
    priority: Optional[int] = None
    content: str


class CompleteQuestionRequest(BaseModel):
    question_id: int
    answers: List[ChoosenAnswer]  # List of ChoosenAnswer objects