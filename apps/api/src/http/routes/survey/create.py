from .dto.create import CreateSurveyRequest
from fastapi import Cookie, HTTPException
from src.clients import SurveyServiceClient, AuthServiceClient
import survey_pb2
from google.protobuf.empty_pb2 import Empty


def create_survey(data: CreateSurveyRequest, session_id: str = Cookie(None)):
    try:
        response = AuthServiceClient.GetUserFromSession(Empty(), metadata=(("session_id", session_id),))
        SurveyServiceClient.CreateSurvey(survey_pb2.CreateSurveyRequest(created_by=response.user.id, **data.model_dump()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create survey: {str(e)}")