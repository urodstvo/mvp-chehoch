from typing import Optional
from google.protobuf.empty_pb2 import Empty
from fastapi import Cookie, Form, HTTPException, UploadFile
from src.clients import SurveyServiceClient, AuthServiceClient
import survey_pb2
from mimetypes import guess_extension
import uuid
from src.files import upload_file


def update_question( 
        question_id: int,    
        content: Optional[str] = Form(None),
        type: Optional[int] = Form(None),
        image: Optional[UploadFile] = Form(None) ,
        session_id: str = Cookie(None)
      ):
    try:
        response = AuthServiceClient.GetUserFromSession(Empty(), metadata=(("session_id", session_id),))
        request = survey_pb2.UpdateQuestionRequest(
            question_id=question_id,
            content=content,
            type=type
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
            
            request.file_id = file.file_id

            
        SurveyServiceClient.UpdateQuestion(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update question: {str(e)}")