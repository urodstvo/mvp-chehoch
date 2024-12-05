from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AnswerVariant(BaseModel):
    id: int
    question_id: int
    content: str
    t_created_at: datetime
    t_updated_at: datetime
    t_deleted: bool
