from .auth import router
from .dto.register import RegisterRequest
from fastapi import Response

from src.clients import AuthServiceClient
import auth_pb2

from src.session import set_session_cookie

def register(data: RegisterRequest, response: Response):
    response = AuthServiceClient.Register(auth_pb2.RegisterRequest(
        login=data.login, password=data.password, email=data.email
    ))

    set_session_cookie(response, response.session_id)

    return