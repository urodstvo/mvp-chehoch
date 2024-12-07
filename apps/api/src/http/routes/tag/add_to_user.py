from fastapi import HTTPException, Cookie

from src.clients import AuthServiceClient
import auth_pb2

from .dto.add_to_user import AddTagsToUserRequest

def add_to_user(data: AddTagsToUserRequest, session_id: str = Cookie(None)):
    try:
        AuthServiceClient.AddTagsToUser(auth_pb2.AddTagsToUserRequest(tags=data.tags), metadata=(("session_id", session_id),))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add tag to user: {str(e)}")
