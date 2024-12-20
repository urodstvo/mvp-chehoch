from .dto.login import LoginRequest
from fastapi import Response

from src.clients import AuthServiceClient
import auth_pb2

from src.session import set_session_cookie

def login(data: LoginRequest, response: Response):
    res = AuthServiceClient.Login(auth_pb2.LoginRequest(login=data.login, password=data.password))

    set_session_cookie(response, res.session_id)

    return