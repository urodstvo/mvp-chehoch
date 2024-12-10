from fastapi import Cookie, HTTPException
import survey_pb2
from src.clients import SurveyServiceClient, AuthServiceClient
from google.protobuf.empty_pb2 import Empty

from src.models import Survey, Tag
from .dto.get import GetSurveyResponse

def get_completed_surveys(session_id: str = Cookie(None)):
    try:
        response = AuthServiceClient.GetUserFromSession(Empty(), metadata=(("session_id", session_id),))
        response = SurveyServiceClient.GetCompletedSurveys(survey_pb2.GetCompletedSurveysRequest(user_id=response.user.id))
        res = []

        if response.survey:
            for survey in response.survey:
                tags = SurveyServiceClient.GetSurveyTags(survey_pb2.GetSurveyTagsRequest(survey_id=survey.id)).tags

                res.append(GetSurveyResponse(
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
                        ) for tag in tags ]
                    ))

        return res
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get completed surveys: {str(e)}")