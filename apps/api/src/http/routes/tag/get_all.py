from fastapi import HTTPException
import survey_pb2
from src.clients import SurveyServiceClient
from src.models import Tag
from google.protobuf.empty_pb2 import Empty


def get_all_tags():
    try:
        response: survey_pb2.GetAllTagsResponse = SurveyServiceClient.GetAllTags(Empty())
        return [Tag(
            id=tag.id, 
            name=tag.name,
            t_created_at=Tag.timestamp_to_datetime(tag.t_created_at),
            t_updated_at=Tag.timestamp_to_datetime(tag.t_updated_at),
            t_deleted=tag.t_deleted
        ) for tag in response.tags]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get survey tags: {str(e)}")