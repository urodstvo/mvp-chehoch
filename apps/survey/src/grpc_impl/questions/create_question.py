from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.questions import Question


def CreateQuestion(request, context: ServicerContext):
    try:
        with Session() as session:
            # Создание нового вопроса
            new_question = Question(
                survey=request.survey_id,
                content=request.content,
                type=request.type,
                answers_amount=0
            )

            # Сохраняем вопрос в базе данных
            session.add(new_question)
            session.commit()

    except Exception as e:
        # Обработка исключений и возврат ошибки
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        return Empty()

    return Empty()
