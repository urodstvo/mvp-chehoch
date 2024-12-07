from fastapi import HTTPException
import survey_pb2
from src.clients import SurveyServiceClient
from src.models import Tag


def get_survey_tags(survey_id: int):
    try:
        response: survey_pb2.GetSurveyTagsResponse = SurveyServiceClient.GetSurveyTags(survey_pb2.GetSurveyTagsRequest(survey_id=survey_id))
        return [Tag(
            id=tag.id, 
            name=tag.name,
            t_created_at=Tag.timestamp_to_datetime(tag.t_created_at),
            t_updated_at=Tag.timestamp_to_datetime(tag.t_updated_at),
            t_deleted=tag.t_deleted
        ) for tag in response.tags]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get survey tags: {str(e)}")