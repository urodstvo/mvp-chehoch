from .dto.register import RegisterRequest
from fastapi import HTTPException, Response

from src.clients import AuthServiceClient
import auth_pb2

from src.session import set_session_cookie

def register(data: RegisterRequest, response: Response):
    try:
        res = AuthServiceClient.Register(auth_pb2.RegisterRequest(
            login=data.login, password=data.password, email=data.email
        ))

        set_session_cookie(response, res.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to logout: {str(e)}")

    return