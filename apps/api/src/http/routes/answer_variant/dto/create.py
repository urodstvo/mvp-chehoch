from pydantic import BaseModel

class CreateAnswerVariantRequest(BaseModel):
    content: str
    question_id: int
