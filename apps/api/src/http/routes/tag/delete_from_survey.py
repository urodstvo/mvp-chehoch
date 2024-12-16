from fastapi import HTTPException
from src.clients import SurveyServiceClient
from .dto.delete_from_survey import DeleteTagsFromSurveyRequest

import survey_pb2


def delete_from_survey(survey_id: int, data: DeleteTagsFromSurveyRequest):
    try:
        SurveyServiceClient.DeleteTagsFromSurvey(survey_pb2.DeleteTagsFromSurveyRequest(survey_id=survey_id, tags=data.tags))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add tag to survey: {str(e)}")