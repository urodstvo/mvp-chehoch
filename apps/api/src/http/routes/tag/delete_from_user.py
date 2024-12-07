from fastapi import HTTPException, Cookie

from src.clients import AuthServiceClient
import auth_pb2

from .dto.delte_from_user import DeleteTagsFromUserRequest

def delete_from_user(data: DeleteTagsFromUserRequest, session_id: str = Cookie(None)):
    try:
        AuthServiceClient.DeleteTagsFromUser(auth_pb2.DeleteTagsFromUserRequest(tags=data.tags), metadata=(("session_id", session_id),))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add tag to user: {str(e)}")
