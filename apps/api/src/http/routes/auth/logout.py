from fastapi import Cookie, HTTPException, Response

from src.clients import AuthServiceClient
from google.protobuf.empty_pb2 import Empty

from src.session import clear_session_cookie

def logout(response: Response, session_id: str = Cookie(None)):
    try:
        metadata = (("session_id", session_id),)
        AuthServiceClient.Logout(Empty(), metadata=metadata)

        clear_session_cookie(response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to logout: {str(e)}")

    return