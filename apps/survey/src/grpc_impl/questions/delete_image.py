from datetime import datetime
from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.questions import Question


def DeleteQuestionImage(request, context: ServicerContext):
    try:
        with Session() as session:
            # Найти вопрос по ID
            question = session.query(Question).filter(
                Question.id == request.question_id
            ).first()

            if not question:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details(f"Question with ID {request.question_id} does not exist.")
                return Empty()

            # Пометка как удаленного
            question.image = None
            question.updated_at = datetime.now()

            # Сохранение изменений
            session.commit()

    except Exception as e:
        # Обработка исключений
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        return Empty()

    return Empty()
