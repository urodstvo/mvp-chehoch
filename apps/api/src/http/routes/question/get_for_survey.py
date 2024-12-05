from src.clients import SurveyServiceClient
from fastapi import HTTPException
import survey_pb2

from src.models import Question

def get_survey_questions(survey_id: int):
    try:
        response: survey_pb2.GetSurveyQuestionsResponse = SurveyServiceClient.GetSurveyQuestions(survey_pb2.GetSurveyQuestionsRequest(survey_id=survey_id))
        
        res = []
        for question in response.questions:
            res.append(Question(
                id=question.id,
                survey_id=question.survey_id,
                type=Question.string_value_to_str(question.type),
                content=Question.string_value_to_str(question.content),
                answers_amount=question.answers_amount,
                t_created_at=Question.timestamp_to_datetime(question.t_created_at),
                t_updated_at=Question.timestamp_to_datetime(question.t_updated_at),
                t_deleted=question.t_deleted,
            ))

        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get survey questions: {str(e)}")