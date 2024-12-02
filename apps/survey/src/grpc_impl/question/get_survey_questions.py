from google.protobuf.empty_pb2 import Empty
from google.protobuf.timestamp_pb2 import Timestamp
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.questions import Question
from src.models.surveys import Survey
import survey_pb2


def GetSurveyQuestions(request, context: ServicerContext):
    try:
        with Session() as session:
            # Поиск вопросов для заданного опроса
            questions = session.query(Question).filter(
                Question.survey_id == request.survey_id,
                Question.t_deleted == False
            ).all()

            if not questions:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details(f"No questions found for survey ID {request.survey_id}")
                return Empty()

            survey_questions = []
            for question in questions:
                t_created_at = Timestamp()
                t_created_at.FromDatetime(question.t_created_at)
                t_updated_at = Timestamp()
                t_updated_at.FromDatetime(question.t_updated_at)
                
                survey_questions.append(survey_pb2.Question(
                    question_id=question.question_id,
                    survey_id=question.survey_id,
                    content=question.content,
                    type=question.type,
                    t_created_at=t_created_at,
                    t_updated_at=t_updated_at,
                    t_deleted=question.t_deleted,
                ))

            return survey_pb2.GetSurveyQuestionsResponse(questions=survey_questions)

    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
