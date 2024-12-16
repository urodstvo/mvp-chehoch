from fastapi import HTTPException
from src.clients import SurveyServiceClient
import survey_pb2

from src.models import AnswerVariant


def get_question_answer_variants(question_id: int):
    try:
        response = SurveyServiceClient.GetQuestionAnswerVariants(survey_pb2.GetQuestionAnswerVariantsRequest(question_id=question_id))
        
        res = []
        for answer in response.answer_variant:
            res.append(AnswerVariant(
                id=answer.id,
                question_id=answer.question_id,
                content=answer.content,
                t_created_at=AnswerVariant.timestamp_to_datetime(answer.t_created_at),
                t_updated_at=AnswerVariant.timestamp_to_datetime(answer.t_updated_at),
                t_deleted=answer.t_deleted,
            ))

        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get question answer variants: {str(e)}")