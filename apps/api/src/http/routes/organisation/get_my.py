from fastapi import Cookie, HTTPException
from src.clients import AuthServiceClient
import auth_pb2
from google.protobuf.empty_pb2 import Empty

from src.models import Organisation


def get_my_organisations(session_id: str = Cookie(None)):
    try: 
        response: auth_pb2.GetOrganisationResponse = AuthServiceClient.GetUserOrganisations(Empty(), metadata=(("session_id", session_id),))
        orgs = response.organisations

        res = []
        for organisation in orgs:
            res.append(Organisation(
                id=organisation.id,
                name=organisation.name,
                supervisor=organisation.supervisor,
                email=Organisation.string_value_to_str(organisation.email),
                phone=Organisation.string_value_to_str(organisation.phone),
                address=Organisation.string_value_to_str(organisation.address),
                web_site=Organisation.string_value_to_str(organisation.web_site),
                inn=Organisation.string_value_to_str(organisation.inn),
                t_created_at=Organisation.timestamp_to_datetime(organisation.t_created_at),
                t_updated_at=Organisation.timestamp_to_datetime(organisation.t_updated_at),
                t_deleted=organisation.t_deleted,
            ))

        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get organisation: {str(e)}")