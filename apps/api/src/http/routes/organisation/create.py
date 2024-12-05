from fastapi import Cookie, HTTPException
from .dto.create import CreateOrganisationRequest

from src.clients import AuthServiceClient
import auth_pb2

def create_organisation(data: CreateOrganisationRequest, session_id: str = Cookie(None)):
    try:
        response = AuthServiceClient.GetUserFromSession(metadata=(("session_id", session_id),))
        AuthServiceClient.CreateOrganisation(auth_pb2.CreateOrganisationRequest(supervisor=response.id, **data.model_dump()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create organisation: {str(e)}")