from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.questions import Question
from datetime import datetime


def UpdateQuestion(request, context: ServicerContext):
    try:
        with Session() as session:
            # Найти вопрос по ID
            question = session.query(Question).filter(
                Question.question_id == request.question_id
            ).first()

            if not question:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details(f"Question with ID {request.question_id} does not exist.")
                return Empty()

            # Обновление данных вопроса
            if request.content:
                question.content = request.content
            if request.type:
                if request.type not in (0, 1, 2):  # Проверка допустимых значений типа
                    context.set_code(StatusCode.INVALID_ARGUMENT)
                    context.set_details(f"Invalid question type: {request.type}.")
                    return Empty()
                question.type = request.type


            # Сохранение изменений
            session.commit()

    except Exception as e:
        # Обработка исключений
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        return Empty()

    return Empty()
