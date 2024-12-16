from fastapi import HTTPException
import survey_pb2

from .dto.get import GetSurveyResponse
from src.models import Survey, Tag
from src.clients import SurveyServiceClient

def get_survey(survey_id: int):
    try:
        survey: survey_pb2.GetSurveyResponse = SurveyServiceClient.GetSurvey(survey_pb2.GetSurveyRequest(survey_id=survey_id)).survey
        tags = SurveyServiceClient.GetSurveyTags(survey_pb2.GetSurveyTagsRequest(survey_id=survey.id)).tags

        return GetSurveyResponse(
                survey=Survey(
                    id=survey.id,
                    name=Survey.string_value_to_str(survey.name),
                    description=Survey.string_value_to_str(survey.description),
                    questions_amount=survey.questions_amount,
                    answers_amount=survey.answers_amount,
                    created_by=survey.created_by,
                    organisation_id=survey.organisation_id,
                    t_created_at=Survey.timestamp_to_datetime(survey.t_created_at),
                    t_updated_at=Survey.timestamp_to_datetime(survey.t_updated_at),
                    t_deleted=survey.t_deleted,
                ),
                tags=[
                    Tag(
                        id=tag.id,
                        name=tag.name,
                        t_created_at=Tag.timestamp_to_datetime(tag.t_created_at),
                        t_updated_at=Tag.timestamp_to_datetime(tag.t_updated_at),
                        t_deleted=tag.t_deleted,
                    )  for tag in tags ]
                )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get survey: {str(e)}")