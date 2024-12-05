from .dto.create import CreateAnswerVariantRequest
from fastapi import HTTPException

from src.clients import SurveyServiceClient
import survey_pb2


def create_answer_variant(data: CreateAnswerVariantRequest): 
    try:
        SurveyServiceClient.UpdateAnswerVariant(survey_pb2.UpdateAnswerVariantRequest(**data.model_dump()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create answer variant: {str(e)}")