from fastapi import Cookie, HTTPException
from src.clients import SurveyServiceClient, AuthServiceClient
from google.protobuf.empty_pb2 import Empty
import survey_pb2

from .dto.complete import CompleteQuestionRequest

def complete_question(data: CompleteQuestionRequest, question_id: int, session_id: str = Cookie(None)):
    try:
        response = AuthServiceClient.GetUserFromSession(Empty(), metadata=(("session_id", session_id),))
        
        request = survey_pb2.CompleteQuestionRequest(question_id=data.question_id, user_id=response.id, answers = [
            survey_pb2.ChoosenAnswer(**answer.model_dump()) for answer in data.answers ])
        SurveyServiceClient.CompleteQuestion(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to complete question: {str(e)}")