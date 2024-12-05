from .dto.update import UpdateQuestionRequest
from fastapi import Cookie, HTTPException
from src.clients import SurveyServiceClient, AuthServiceClient
import survey_pb2
from mimetypes import guess_extension
import uuid
from src.files import upload_file


def update_question(data: UpdateQuestionRequest, question_id: int,  session_id: str = Cookie(None)):
    try:
        response = AuthServiceClient.GetUserFromSession(metadata=(("session_id", session_id),))
        request =survey_pb2.UpdateQuestionRequest(
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

            
        SurveyServiceClient.UpdateQuestion(survey_pb2.UpdateQuestionRequest(question_id=question_id, **data.model_dump()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update question: {str(e)}")