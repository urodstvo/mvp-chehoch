from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from models.users_surveys import UserSurvey 
from models.surveys import Survey
from sqlalchemy import update
from datetime import datetime

def CompleteSurvey(request, context: ServicerContext):
    try:
        with Session() as session:
            session.add(UserSurvey(
                user_id=request.user_id,
                survey_id=request.survey_id
            ))
            stmt = update(Survey).where(Survey.id == request.survey_id).values(t_updated_at=datetime.now(), answers_amount=Survey.answers_amount + 1)
            session.execute(stmt)
            session.commit()
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
