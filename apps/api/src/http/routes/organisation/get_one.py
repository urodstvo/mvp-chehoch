from fastapi import HTTPException
from src.clients import AuthServiceClient
import auth_pb2

from src.models import Organisation


def get_organisation(organisation_id: int):
    try: 
        response: auth_pb2.GetOrganisationResponse = AuthServiceClient.GetOrganisation(auth_pb2.GetOrganisationRequest(organisation_id=organisation_id))
        return Organisation(
            id=response.organisation.id,
            name=response.organisation.name,
            supervisor=response.organisation.supervisor,
            email=Organisation.string_value_to_str(response.organisation.email),
            phone=Organisation.string_value_to_str(response.organisation.phone),
            address=Organisation.string_value_to_str(response.organisation.address),
            web_site=Organisation.string_value_to_str(response.organisation.web_site),
            inn=Organisation.string_value_to_str(response.organisation.inn),
            t_created_at=Organisation.timestamp_to_datetime(response.organisation.t_created_at),
            t_updated_at=Organisation.timestamp_to_datetime(response.organisation.t_updated_at),
            t_deleted=response.organisation.t_deleted,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get organisation: {str(e)}")