from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.questions import Question
from src.models.answers import Answer
from src.models.choices import Choice
from src.models.user_answers import UserAnswer
from datetime import datetime
#

def CompleteQuestion(request, context: ServicerContext):
    try:
        with Session() as session:
            # Проверка существования вопроса
            question = session.query(Question).filter(
                Question.question_id == request.question_id
            ).first()

            if not question:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details(f"Question with ID {request.question_id} does not exist.")
                return Empty()

            # Перебор выбранных пользователем ответов
            user_answers = []
            for answer in request.answers:
                # Проверка на существование выбранных вариантов ответа
                choice = session.query(Choice).filter(
                    Choice.choice_id == answer.choice_id,
                    Choice.question_id == request.question_id
                ).first()

                if not choice:
                    context.set_code(StatusCode.NOT_FOUND)
                    context.set_details(f"Choice with ID {answer.choice_id} for question ID {request.question_id} does not exist.")
                    return Empty()

                # Создание записи о выбранном ответе
                user_answer = UserAnswer(
                    question_id=request.question_id,
                    user_id=request.user_id,
                    choice_id=answer.choice_id,
                    t_created_at=datetime.utcnow()
                )
                user_answers.append(user_answer)

            # Сохраняем все ответы пользователя в базу данных
            session.bulk_save_objects(user_answers)
            session.commit()

    except Exception as e:
        # Обработка ошибок
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        return Empty()

    return Empty()
