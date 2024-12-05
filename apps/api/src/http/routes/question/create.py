from .dto.create import CreateQuestionRequest

from src.clients import SurveyServiceClient
from fastapi import HTTPException

import survey_pb2

def create_question(data: CreateQuestionRequest):
    try:
        SurveyServiceClient.CreateQuestion(survey_pb2.CreateQuestionRequest(**data.model_dump()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create question: {str(e)}")