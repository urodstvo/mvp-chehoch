from fastapi import Cookie, HTTPException
import auth_pb2
from src.clients import AuthServiceClient
from src.models import Tag
from google.protobuf.empty_pb2 import Empty


def get_user_tags(session_id: str = Cookie(None)):
    try:
        response: auth_pb2.GetUserTagsResponse = AuthServiceClient.GetUserTags(Empty(), metadata=(("session_id", session_id),))
        return [Tag(
            id=tag.id, 
            name=tag.name,
            t_created_at=Tag.timestamp_to_datetime(tag.t_created_at),
            t_updated_at=Tag.timestamp_to_datetime(tag.t_updated_at),
            t_deleted=tag.t_deleted
        ) for tag in response.tags]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get survey tags: {str(e)}")