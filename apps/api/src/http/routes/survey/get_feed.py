from fastapi import Cookie, HTTPException

from src.models import Survey
from .helpers.recomendations import get_survey_recommendations

from src.clients import SurveyServiceClient
import survey_pb2


def get_survey_feed(session_id: str = Cookie(None)):
    try:
        recs = get_survey_recommendations(session_id)
        survey_ids = [rec[0] for rec in recs]
        response = SurveyServiceClient.GetSurveys(survey_pb2.GetSurveysRequest(survey_ids=survey_ids))
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
        raise HTTPException(status_code=500, detail=f"Failed to get survey feed: {str(e)}")