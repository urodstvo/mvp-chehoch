from typing import List
import survey_pb2
from fastapi import HTTPException

from src.models import Survey, Question, Answer, AnswerVariant
from src.clients import SurveyServiceClient


from .dto.get_report import GetSurveyReportResponse, ReportQuestion

def get_survey_report(survey_id: int):
    try:
        response: survey_pb2.GetSurveyReportResponse = SurveyServiceClient.GetSurveyReport(survey_pb2.GetSurveyReportRequest(survey_id=survey_id))    
        res: List[ReportQuestion] = []

        for question in response.questions:
            res.append(ReportQuestion(
                question=Question(
                    id=question.question.id,
                    survey_id=question.question.survey_id,
                    type=Question.string_value_to_str(question.question.type),
                    content=Question.string_value_to_str(question.question.content),
                    answers_amount=question.question.answers_amount,
                    t_created_at=Question.timestamp_to_datetime(question.question.t_created_at),
                    t_updated_at=Question.timestamp_to_datetime(question.question.t_updated_at),
                    t_deleted=question.question.t_deleted,
                ),
                answer_variants=[AnswerVariant(
                    id=answer_variant.id,
                    question_id=answer_variant.question_id,
                    content=AnswerVariant.string_value_to_str(answer_variant.content),
                    t_created_at=AnswerVariant.timestamp_to_datetime(answer_variant.t_created_at),
                    t_updated_at=AnswerVariant.timestamp_to_datetime(answer_variant.t_updated_at),
                    t_deleted=answer_variant.t_deleted,
                ) for answer_variant in question.answer_variants],
                answers=[Answer(
                    id=answer.id,
                    question_id=answer.question_id,
                    user_id=answer.user_id,
                    answer_variant_id=answer.answer_variant_id,
                    content=Answer.string_value_to_str(answer.content),
                    priority=Answer.int32_value_to_int(answer.priority),
                    t_created_at=Answer.timestamp_to_datetime(answer.t_created_at),
                    t_updated_at=Answer.timestamp_to_datetime(answer.t_updated_at),
                    t_deleted=answer.t_deleted, 
                ) for answer in question.answers]
            ))
        
        return GetSurveyReportResponse(
            survey=Survey(
                id=response.survey.id,
                name=Survey.string_value_to_str(response.survey.name),
                description=Survey.string_value_to_str(response.survey.description),
                questions_amount=response.survey.questions_amount,
                answers_amount=response.survey.answers_amount,
                created_by=response.survey.created_by,
                organisation_id=response.survey.organisation_id,
                t_created_at=Survey.timestamp_to_datetime(response.survey.t_created_at),
                t_updated_at=Survey.timestamp_to_datetime(response.survey.t_updated_at),
                t_deleted=Survey.timestamp_to_datetime(response.survey.t_deleted),
            ),
            questions=res
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get survey report: {str(e)}")