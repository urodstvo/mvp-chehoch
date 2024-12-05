from fastapi import HTTPException
from .dto.update import UpdateOrganisationRequest

from src.clients import AuthServiceClient
import auth_pb2

def update_organisation(data: UpdateOrganisationRequest, organisation_id: int):
    try:
        AuthServiceClient.UpdateOrganisation(auth_pb2.UpdateOrganisationRequest(organisation_id=organisation_id, **data.model_dump()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update organisation: {str(e)}")