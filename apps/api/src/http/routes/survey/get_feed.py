from fastapi import Cookie, HTTPException

from src.models import Survey, Tag
from .helpers.recomendations import get_survey_recommendations

from src.clients import SurveyServiceClient
import survey_pb2
from .dto.get import GetSurveyResponse


def get_survey_feed(session_id: str = Cookie(None)):
    try:
        recs = get_survey_recommendations(session_id)
        survey_ids = [rec[0] for rec in recs]
        response = SurveyServiceClient.GetSurveys(survey_pb2.GetSurveysRequest(surveys_ids=survey_ids))
        res = []

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
                    ) 
                    for tag in tags ]
                ))

            return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get survey feed: {str(e)}")