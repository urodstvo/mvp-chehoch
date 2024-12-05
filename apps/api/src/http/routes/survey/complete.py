from fastapi import Cookie, HTTPException
from src.clients import SurveyServiceClient, AuthServiceClient
from google.protobuf.empty_pb2 import Empty
import survey_pb2

def complete_survey(survey_id: int, session_id: str = Cookie(None)):
    try:
        response = AuthServiceClient.GetUserFromSession(Empty(), metadata=(("session_id", session_id),))
        SurveyServiceClient.CompleteSurvey(survey_pb2.CompleteSurveyRequest(survey_id=survey_id, user_id=response.id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to complete survey: {str(e)}")