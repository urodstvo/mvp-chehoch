from pydantic import BaseModel
from typing import Optional

class UpdateAnswerVariantRequest(BaseModel):
    content: str
    question_id: int
