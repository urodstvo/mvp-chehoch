from config.variables import MINIO_URL
from src.clients import SurveyServiceClient
from fastapi import HTTPException
import survey_pb2

from src.models import Question

def get_survey_questions(survey_id: int):
    try:
        response: survey_pb2.GetSurveyQuestionsResponse = SurveyServiceClient.GetSurveyQuestions(survey_pb2.GetSurveyQuestionsRequest(survey_id=survey_id))
        res = []
        
        for question in response.questions:
            question = Question(
                id=question.id,
                survey_id=question.survey_id,
                type=Question.string_value_to_str(question.type),
                content=Question.string_value_to_str(question.content),
                answers_amount=question.answers_amount,
                t_created_at=Question.timestamp_to_datetime(question.t_created_at),
                t_updated_at=Question.timestamp_to_datetime(question.t_updated_at),
                t_deleted=question.t_deleted,
                image=Question.int32_value_to_int(question.image),
            )

            if question.image:
                file = SurveyServiceClient.GetFile(survey_pb2.GetFileRequest(file_id=question.image))
                question.image_url = f"http://{MINIO_URL}/chehoch/{file.file.filename}"
            res.append(question)

        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get survey questions: {str(e)}")