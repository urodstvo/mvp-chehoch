from fastapi.responses import JSONResponse
import src.models as models
from src.clients import AuthServiceClient
from google.protobuf.empty_pb2 import Empty
from fastapi import Cookie, HTTPException
from .dto.get_me import UserWithProfile

import auth_pb2


def get_user_from_session(session_id: str = Cookie(None)):
    try:
        metadata = (("session_id", session_id),)
        grpc_response: auth_pb2.GetUserFromSessionResponse = AuthServiceClient.GetUserFromSession(Empty(), metadata=metadata)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user data: {str(e)}")


    # marital_status = None
    # if grpc_response.HasField("marital_status"):
    #     if isinstance(grpc_response.marital_status, auth_pb2.MaritalStatus):
    #         marital_status = grpc_response.marital_status.value
    #     elif isinstance(grpc_response.marital_status, Empty):
    #         marital_status = None

    # education_level = None
    # if grpc_response.HasField("education_level"):
    #     if isinstance(grpc_response.education_level, auth_pb2.EducationLevel):
    #         education_level = grpc_response.education_level.value
    #     elif isinstance(grpc_response.education_level, Empty):
    #         education_level = None  

    profile = models.Profile(
        user_id=grpc_response.user.id,
        profession=grpc_response.user.proffession.value if grpc_response.user.HasField("proffession") else None,
        birth_date=grpc_response.user.birth_date.ToDatetime() if grpc_response.user.HasField("birth_date") else None,
        # marital_status=marital_status,
        # education_level=education_level,
    )

    user = models.User(
        id=grpc_response.user.id,
        login=grpc_response.user.login,
        email=grpc_response.user.email,
        t_created_at=grpc_response.user.t_created_at.ToDatetime(),
        t_updated_at=grpc_response.user.t_updated_at.ToDatetime(),
        t_deleted=grpc_response.user.t_deleted,
    )

    return UserWithProfile(
        user=user,
        profile=profile,
    )


