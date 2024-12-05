from .auth import router
from fastapi import Cookie, Response

from src.clients import AuthServiceClient
from google.protobuf.empty_pb2 import Empty

from src.session import clear_session_cookie

def logout(response: Response, session_id: str = Cookie(None)):
    metadata = (("session_id", session_id),)
    response = AuthServiceClient.Logout(Empty(), metadata=metadata)

    clear_session_cookie(response, response.session_id)

    return