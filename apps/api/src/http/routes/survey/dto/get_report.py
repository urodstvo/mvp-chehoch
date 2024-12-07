from typing import List
from pydantic import BaseModel

from src.models import Survey, Question, Answer, AnswerVariant

class ReportQuestion(BaseModel):
    question: Question  # Reference to the Question model
    answer_variants: List[AnswerVariant]  # List of AnswerVariant instances
    answers: List[Answer]  # List of Answer instances


class GetSurveyReportResponse(BaseModel):
    survey: Survey  # Reference to the Survey model
    questions: List[ReportQuestion]  # List of ReportQuestion instances
