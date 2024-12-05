from fastapi import Cookie, HTTPException
from src.clients import AuthServiceClient
import auth_pb2
from .get_my import get_my_organisations

def delete_organisation(organisation_id: int, session_id: str = Cookie(None)):
    orgs = get_my_organisations(session_id=session_id)
    if organisation_id not in [org.id for org in orgs]:
        raise HTTPException(status_code=404, detail="Organisation not found")

    try:
        AuthServiceClient.DeleteOrganisation(auth_pb2.DeleteOrganisationRequest(organisation_id=organisation_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete organisation: {str(e)}")