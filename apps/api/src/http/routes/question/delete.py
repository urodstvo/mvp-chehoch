
from fastapi import HTTPException
import survey_pb2
from src.clients import SurveyServiceClient

def delete_question(question_id: int):
    try:
        SurveyServiceClient.DeleteQuestion(survey_pb2.DeleteQuestionRequest(question_id=question_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete question: {str(e)}")