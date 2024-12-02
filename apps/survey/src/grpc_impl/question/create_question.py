from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.users_surveys import UserSurvey 
from src.models.surveys import Survey
from src.models.questions import Question
from sqlalchemy import update
from datetime import datetime


def CreateQuestion(request, context: ServicerContext):
    try:
        with Session() as session:
            # Проверка существования опроса
            survey_exists = session.query(Survey).filter(
                Survey.survey_id == request.survey_id
            ).first()

            if not survey_exists:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details(f"Survey with ID {request.survey_id} does not exist.")
                return Empty()

            # Создание нового вопроса
            new_question = Question(
                survey_id=request.survey_id,
                content=request.content,
                type=request.type
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
