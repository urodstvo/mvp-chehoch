
from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.surveys import Survey 

from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import StringValue
from config.logger import logger

import survey_pb2
def GetSurvey(request, context: ServicerContext):
    try:
        with Session() as session:
            survey = session.query(Survey).filter(Survey.id == request.survey_id, Survey.t_deleted == False).first()
            if survey is None:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Survey not found")
                return Empty()
            
            t_created_at = Timestamp()
            t_created_at.FromDatetime(survey.t_created_at)
            t_updated_at = Timestamp()
            t_updated_at.FromDatetime(survey.t_updated_at)
            
            return survey_pb2.GetSurveyResponse(survey=survey_pb2.Survey(
                id=survey.id,
                name=StringValue(value=survey.name),
                description=StringValue(value=survey.description),
                questions_amount=survey.questions_amount,
                answers_amount=survey.answers_amount,
                created_by=survey.created_by,
                organisation_id=survey.organisation_id,
                t_created_at=t_created_at,
                t_updated_at=t_updated_at,
                t_deleted=survey.t_deleted
            ))
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        logger.error(str(e))

    return survey_pb2.GetSurveyResponse()
