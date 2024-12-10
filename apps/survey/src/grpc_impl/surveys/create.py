from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.surveys import Survey 
from config.logger import logger

def CreateSurvey(request, context: ServicerContext):
    try:
        with Session() as session:
            new_survey = Survey(
                created_by=request.created_by,
                organisation_id=request.organisation_id
            )
            session.add(new_survey)
            session.commit()
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        logger.error(str(e))

    return Empty()
