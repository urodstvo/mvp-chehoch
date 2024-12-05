from google.protobuf.empty_pb2 import Empty
from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import Int32Value, StringValue
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.answers import Answer
import survey_pb2


def GetQuestionAnswers(request, context: ServicerContext):
    try:
        with Session() as session:
            # Поиск вопросов для заданного опроса
            answers = session.query(Answer).filter(
                Answer.question_id == request.question_id,
                Answer.created_by == request.user_id,
                Answer.t_deleted == False
            ).all()

            if not answers:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details(f"No answers found for question ID {request.question_id}")
                return Empty()

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

            return survey_pb2.GetQuestionAnswersResponse(answer=question_answers)

    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
