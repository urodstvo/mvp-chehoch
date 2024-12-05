
from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.surveys import File 
from src.models.questions import Question 
from src.models.answer_variants import AnswerVariant 
from src.models.answers import Answer 

from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import StringValue, Int32Value
from config.logger import logger

import survey_pb2
def GetSurveyReport(request, context: ServicerContext):
    try:
        with Session() as session:
            survey = session.query(File).filter(
                File.id == request.survey_id, 
                File.t_deleted == False
            ).first()
            if survey is None:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Survey not found")
                return Empty()
            
            questions = session.query(Question).filter(
                Question.survey == request.survey_id
            ).all()

            survey_questions = []
            for question in questions:
                answers = session.query(Answer).filter(
                    Answer.question_id == question.id,
                    Answer.t_deleted == False
                ).all()
                question_answers = []
                for answer in answers:
                    t_created_at = Timestamp()
                    t_created_at.FromDatetime(answer.t_created_at)
                    t_updated_at = Timestamp()
                    t_updated_at.FromDatetime(answer.t_updated_at)
                    
                    question_answers.append(survey_pb2.Answer(
                        id=answer.id,
                        question_id=answer.question_id,
                        user_id=answer.created_by,
                        answer_variant_id=answer.answer_variant_id,
                        content=answer.content,
                        priority=Int32Value(value=answer.priority),
                        t_created_at=t_created_at,
                        t_updated_at=t_updated_at,
                        t_deleted=answer.t_deleted,
                    ))

                answer_variants = session.query(AnswerVariant).filter(
                    AnswerVariant.question_id == question.id,
                    AnswerVariant.t_deleted == False
                ).all()
                question_answer_variants = []
                for answer_variant in answer_variants:
                    t_created_at = Timestamp()
                    t_created_at.FromDatetime(answer_variant.t_created_at)
                    t_updated_at = Timestamp()
                    t_updated_at.FromDatetime(answer_variant.t_updated_at)
                    
                    question_answer_variants.append(survey_pb2.AnswerVariant(
                        id=answer_variant.id,
                        question_id=answer_variant.question_id,
                        content=answer_variant.content,
                        t_created_at=t_created_at,
                        t_updated_at=t_updated_at,
                        t_deleted=answer_variant.t_deleted,
                    ))
                


                t_created_at = Timestamp()
                t_created_at.FromDatetime(question.t_created_at)
                t_updated_at = Timestamp()
                t_updated_at.FromDatetime(question.t_updated_at)
                
                survey_questions.append(survey_pb2.ReportQuestion(
                    question=survey_pb2.Question(
                    id=question.id,
                    survey_id=question.survey,
                    content=StringValue(value=question.content),
                    type=StringValue(value=question.type),
                    answers_amount=question.answers_amount,
                    t_created_at=t_created_at,
                    t_updated_at=t_updated_at,
                    t_deleted=question.t_deleted,
                ),
                answers=question_answers,
                answer_variants=question_answer_variants
                ))



            t_created_at = Timestamp()
            t_created_at.FromDatetime(survey.t_created_at)
            t_updated_at = Timestamp()
            t_updated_at.FromDatetime(survey.t_updated_at)
            
            return survey_pb2.GetSurveyReportResponse(survey=survey_pb2.Survey(
                id=survey.id,
                name=StringValue(value=survey.name),
                description=StringValue(value=survey.description),
                questions_amount=survey.questions_amount,
                answers_amount=survey.answers_amount,
                created_by=survey.created_by,
                organisation_id=survey.organisation_id,
                t_created_at=t_created_at,
                t_updated_at=t_updated_at,
                t_deleted=survey.t_deleted
            ),
            questions=survey_questions)
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        logger.error(str(e))

    return survey_pb2.GetSurveyResponse()
