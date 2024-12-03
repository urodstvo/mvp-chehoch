from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.answers import Answer
from src.models.questions import Question
from src.models.surveys import Survey


def CompleteQuestion(request, context: ServicerContext):
    try:
        with Session() as session:
            question = session.query(Question).filter(
                    Question.id == request.question_id,
                    Question.t_deleted == False
                ).first()
            
            survey = session.query(Survey).filter(
                Survey.id==question.survey
            ).first()
            
            question.answers_amount += 1
            survey.answers_amount +=1

            # Создание записи о выбранном ответе
            user_answers = []
            for v in request.answers:
                answer = Answer(
                    question_id=request.question_id,
                    created_by=request.user_id,
                    answer_variant_id=v.answer_variation_id,
                    priority=v.priority,
                    content=v.content
                )

                user_answers.append(answer)

            # Сохраняем все ответы пользователя в базу данных
            session.bulk_save_objects(user_answers)
            session.commit()

    except Exception as e:
        # Обработка ошибок
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        return Empty()

    return Empty()
