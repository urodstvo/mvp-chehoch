from mimetypes import guess_extension
from typing import Optional
import uuid
from fastapi import Cookie, Form, HTTPException, UploadFile
from pydantic import EmailStr

from src.files import upload_file
from google.protobuf.empty_pb2 import Empty

from src.clients import AuthServiceClient, SurveyServiceClient
import auth_pb2
import survey_pb2

def update_organisation(           
        organisation_id: int, 
        name: Optional[str] = Form(None),
        email: Optional[EmailStr] = Form(None),
        phone: Optional[str] = Form(None),
        address: Optional[str] = Form(None),
        inn: Optional[str] = Form(None),
        web_site: Optional[str] = Form(None),
        image: Optional[UploadFile] = Form(None), 
        session_id: str = Cookie(None)
    ):
    try:
        response = AuthServiceClient.GetUserFromSession(Empty(),metadata=(("session_id", session_id),))
        request = auth_pb2.UpdateOrganisationRequest(
            organisation_id=organisation_id,
            name=name,
            email=email,
            phone=phone,
            address=address,
            inn=inn,
            web_site=web_site,
        )

        logo = image
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
                user_id=response.user.id
            ))            
            upload_file(logo)

            request.logo = file.file_id

        AuthServiceClient.UpdateOrganisation(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update organisation: {str(e)}")