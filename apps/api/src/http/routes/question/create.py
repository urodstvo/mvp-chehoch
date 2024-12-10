from mimetypes import guess_extension
import uuid
from src.files import upload_file
from .dto.create import CreateQuestionRequest

from src.clients import SurveyServiceClient, AuthServiceClient
from fastapi import Cookie, HTTPException
from google.protobuf.empty_pb2 import Empty

import survey_pb2

def create_question(data: CreateQuestionRequest):
    try:           
        SurveyServiceClient.CreateQuestion(survey_pb2.CreateQuestionRequest(
            survey_id=data.survey_id,            
            type=data.type
        ))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create question: {str(e)}")