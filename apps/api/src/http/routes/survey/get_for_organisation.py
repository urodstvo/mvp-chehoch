from fastapi import  HTTPException
import survey_pb2
from src.clients import SurveyServiceClient
from google.protobuf.empty_pb2 import Empty
from .dto.get import GetSurveyResponse
from src.models import Survey, Tag

def get_organisation_surveys(organisation_id: int):
    try:
        response = SurveyServiceClient.GetOrganisationSurveys(survey_pb2.GetOrganisationSurveysRequest(organisation_id=organisation_id))
        res = []

        for survey in response.survey:
            tags = SurveyServiceClient.GetSurveyTags(survey_pb2.GetSurveyTagsRequest(survey_id=survey.id)).tags

            res.append(GetSurveyResponse(
                survey=Survey(
                    id=response.survey.id,
                    name=Survey.string_value_to_str(survey.name),
                    description=Survey.string_value_to_str(survey.description),
                    questions_amount=survey.questions_amount,
                    answers_amount=survey.answers_amount,
                    created_by=survey.created_by,
                    organisation_id=survey.organisation_id,
                    t_created_at=Survey.timestamp_to_datetime(survey.t_created_at),
                    t_updated_at=Survey.timestamp_to_datetime(survey.t_updated_at),
                    t_deleted=Survey.timestamp_to_datetime(survey.t_deleted),
                ),
                tags=[
                    Tag(
                        id=tag.id,
                        name=tag.name,
                        t_created_at=Tag.timestamp_to_datetime(tag.t_created_at),
                        t_updated_at=Tag.timestamp_to_datetime(tag.t_updated_at),
                        t_deleted=tag.t_deleted,
                    ) 
                    for tag in tags ]
                ))
        return res
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get completed surveys: {str(e)}")