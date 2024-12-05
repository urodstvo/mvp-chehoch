from fastapi import HTTPException
from src.clients import SurveyServiceClient
from .dto.add_to_survey import AddTagsToSurveyRequest

import survey_pb2


def add_to_survey(survey_id: int, data: AddTagsToSurveyRequest):
    try:
        SurveyServiceClient.AddTagsToSurveyt(survey_pb2.AddTagsToSurveyRequest(survey_id=survey_id, tags=data.tags))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add tag to survey: {str(e)}")