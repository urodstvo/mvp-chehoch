from fastapi import HTTPException
from src.clients import AuthServiceClient, SurveyServiceClient
import auth_pb2
import survey_pb2

from src.models import Organisation
from config.variables import MINIO_URL


def get_organisation(organisation_id: int):
    try: 
        response: auth_pb2.GetOrganisationResponse = AuthServiceClient.GetOrganisation(auth_pb2.GetOrganisationRequest(organisation_id=organisation_id))
        file = SurveyServiceClient.GetFile(survey_pb2.GetFileRequest(file_id=response.organisation.logo))

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
            logo=Organisation.int32_value_to_int(response.organisation.logo),
            logo_url= f"{MINIO_URL}/chehoch/{file.filename}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get organisation: {str(e)}")