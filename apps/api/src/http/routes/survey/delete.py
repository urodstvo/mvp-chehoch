from fastapi import HTTPException
from src.clients import SurveyServiceClient
import survey_pb2

def delete_survey(survey_id: int):
    try:
        SurveyServiceClient.DeleteSurvey(survey_pb2.DeleteSurveyRequest(survey_id=survey_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete survey: {str(e)}")