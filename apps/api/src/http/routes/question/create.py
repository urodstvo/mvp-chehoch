from mimetypes import guess_extension
import uuid
from src.files import upload_file
from .dto.create import CreateQuestionRequest

from src.clients import SurveyServiceClient, AuthServiceClient
from fastapi import Cookie, HTTPException

import survey_pb2

def create_question(data: CreateQuestionRequest, session_id: str = Cookie(None)):
    try:
        response = AuthServiceClient.GetUserFromSession(metadata=(("session_id", session_id),))
        request =survey_pb2.CreateQuestionRequest(
            survey_id=data.survey_id,
            content=data.content,
            type=data.type
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
            
            request.file_id = file.file_id
            
        SurveyServiceClient.CreateQuestion(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create question: {str(e)}")