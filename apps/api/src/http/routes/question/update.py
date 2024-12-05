from .dto.update import UpdateQuestionRequest
from fastapi import HTTPException
from src.clients import SurveyServiceClient
import survey_pb2

def update_question(data: UpdateQuestionRequest, question_id: int):
    try:
        SurveyServiceClient.UpdateQuestion(survey_pb2.UpdateQuestionRequest(question_id=question_id, **data.model_dump()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update question: {str(e)}")