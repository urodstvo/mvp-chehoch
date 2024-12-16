

from fastapi import Cookie, HTTPException

import auth_pb2
from .dto.update import UpdateUserRequest
from src.clients import AuthServiceClient


def update_user(data: UpdateUserRequest, session_id: str = Cookie(None)):
    try:
        AuthServiceClient.UpdateUser(auth_pb2.UpdateUserRequest(**data.model_dump()), metadata=(("session_id", session_id),))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")

    return