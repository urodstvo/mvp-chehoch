from .dto.update import UpdateSurveyRequest
from fastapi import Cookie, HTTPException
from src.clients import SurveyServiceClient
import survey_pb2


def update_survey(data: UpdateSurveyRequest, survey_id: int):
    try:
        SurveyServiceClient.UpdateSurvey(survey_pb2.UpdateSurveyRequest(survey_id=survey_id, **data.model_dump()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update survey: {str(e)}")