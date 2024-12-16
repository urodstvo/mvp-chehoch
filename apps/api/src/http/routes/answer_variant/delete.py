from src.clients import SurveyServiceClient
import survey_pb2
from fastapi import HTTPException

def delete_answer_variant(answer_variant_id: int):
    try:
        SurveyServiceClient.DeleteAnswerVariant(survey_pb2.DeleteAnswerVariantRequest(answer_variant_id=answer_variant_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete answer: {str(e)}")