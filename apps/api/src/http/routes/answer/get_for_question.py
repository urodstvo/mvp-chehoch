from fastapi import HTTPException
from src.clients import SurveyServiceClient
from src.models import Answer
import survey_pb2

def get_question_answers(question_id: int):
    try:
        response = SurveyServiceClient.GetQuestionAnswers(survey_pb2.GetQuestionAnswersRequest(question_id=question_id))
        
        return [Answer(
            id=answer.id,
            question_id=answer.question_id,
            user_id=answer.user_id,
            answer_variant_id=answer.answer_variant_id,
            content=answer.content,
            priority=Answer.int32_value_to_int(answer.priority),
            t_created_at=Answer.timestamp_to_datetime(answer.t_created_at),
            t_updated_at=Answer.timestamp_to_datetime(answer.t_updated_at),
            t_deleted=answer.t_deleted
        ) for answer in response.answers]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get question answers: {str(e)}")