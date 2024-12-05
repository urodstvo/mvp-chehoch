from google.protobuf.empty_pb2 import Empty
from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import Int32Value, StringValue
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.answer_variants import AnswerVariant
import survey_pb2


def GetQuestionAnswerVariants(request, context: ServicerContext):
    try:
        with Session() as session:
            # Поиск вопросов для заданного опроса
            answer_variants = session.query(AnswerVariant).filter(
                AnswerVariant.question_id == request.question_id,
                AnswerVariant.t_deleted == False
            ).all()

            if not answer_variants:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details(f"No answer variants found for question ID {request.question_id}")
                return Empty()

            question_answers = []
            for answer in answer_variants:
                t_created_at = Timestamp()
                t_created_at.FromDatetime(answer.t_created_at)
                t_updated_at = Timestamp()
                t_updated_at.FromDatetime(answer.t_updated_at)
                
                question_answers.append(survey_pb2.AnswerVariant(
                    id=answer.id,
                    question_id=answer.question_id,
                    content=answer.content,
                    t_created_at=t_created_at,
                    t_updated_at=t_updated_at,
                    t_deleted=answer.t_deleted,
                ))

            return survey_pb2.GetQuestionAnswerVariantsResponse(answer_variant=question_answers)

    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
