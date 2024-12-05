from pydantic import BaseModel

class CreateQuestionRequest(BaseModel):
    survey_id: int
    content: str
    type: int
