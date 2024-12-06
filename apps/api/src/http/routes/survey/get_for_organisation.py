from fastapi import Cookie, HTTPException
import survey_pb2
from src.clients import SurveyServiceClient, AuthServiceClient
from google.protobuf.empty_pb2 import Empty

from src.models import Survey

def get_organisation_surveys(organisation_id: int):
    try:
        response = SurveyServiceClient.GetOrganisationSurveys(survey_pb2.GetOrganisationSurveysRequest(organisation_id=organisation_id))
        res = []

        for survey in response.survey:
            res.append(Survey(
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
            ))

        return res
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get completed surveys: {str(e)}")