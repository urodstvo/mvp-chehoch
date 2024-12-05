from mimetypes import guess_extension
import uuid
from fastapi import Cookie, HTTPException

from src.files import upload_file
from .dto.update import UpdateOrganisationRequest

from src.clients import AuthServiceClient, SurveyServiceClient
import auth_pb2
import survey_pb2

def update_organisation(data: UpdateOrganisationRequest, organisation_id: int, session_id: str = Cookie(None)):
    try:
        response = AuthServiceClient.GetUserFromSession(metadata=(("session_id", session_id),))
        request = auth_pb2.UpdateOrganisationRequest(
            organisation_id=organisation_id,
            name=data.name,
            email=data.email,
            phone=data.phone,
            address=data.address,
            inn=data.inn,
            web_site=data.web_site,
        )

        logo = data.logo
        if logo:
            file_extension = guess_extension(logo.content_type)
            logo.filename = f"{uuid.uuid4()}{file_extension}"
            file_content = logo.file.read()  
            file_size = len(file_content)  
            logo.file.seek(0)  
            file = SurveyServiceClient.CreateFile(survey_pb2.CreateFileRequest(
                filename=logo.filename, 
                mime_type=logo.content_type, 
                mem_size=file_size,     
                user_id=response.id
            ))            
            upload_file(logo)

            request.logo = file.file_id

        AuthServiceClient.UpdateOrganisation(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update organisation: {str(e)}")