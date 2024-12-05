from fastapi import HTTPException
import survey_pb2

from src.models import Survey
from src.clients import SurveyServiceClient

def get_survey(survey_id: int):
    try:
        response: survey_pb2.GetSurveyResponse = SurveyServiceClient.GetSurvey(survey_pb2.GetSurveyRequest(survey_id=survey_id))
        return Survey(
            id=response.survey.id,
            name=Survey.string_value_to_str(response.survey.name),
            description=Survey.string_value_to_str(response.survey.description),
            questions_amount=response.survey.questions_amount,
            answers_amount=response.survey.answers_amount,
            created_by=response.survey.created_by,
            organisation_id=response.survey.organisation_id,
            t_created_at=Survey.timestamp_to_datetime(response.survey.t_created_at),
            t_updated_at=Survey.timestamp_to_datetime(response.survey.t_updated_at),
            t_deleted=Survey.timestamp_to_datetime(response.survey.t_deleted),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get survey: {str(e)}")