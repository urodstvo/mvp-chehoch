from .dto.update import UpdateAnswerVariantRequest
from fastapi import HTTPException

from src.clients import SurveyServiceClient
import survey_pb2


def update_answer_variant(data: UpdateAnswerVariantRequest, answer_variant_id: int): 
    try:
        SurveyServiceClient.UpdateAnswerVariant(survey_pb2.UpdateAnswerVariantRequest(answer_variant_id=answer_variant_id, **data.model_dump()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create answer variant: {str(e)}")