from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.surveys import Survey
import survey_pb2 
from config.logger import logger

from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import StringValue

def GetSurveys(request: survey_pb2.GetSurveysRequest, context: ServicerContext):
    survey_ids = request.surveys_ids  # Преобразуем в список
    try:
        if not survey_ids:
            context.set_code(StatusCode.INVALID_ARGUMENT)
            context.set_details("Survey ids not found")
            return Empty()  

        with Session() as session:
            surveys = session.query(Survey).filter(Survey.id.in_(survey_ids), Survey.t_deleted == False).all()

            if not surveys:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Surveys not found")
                return Empty()
            
            res = []
            for survey in surveys:
                t_created_at = Timestamp()
                t_created_at.FromDatetime(survey.t_created_at)
                t_updated_at = Timestamp()
                t_updated_at.FromDatetime(survey.t_updated_at)
            
                res.append(survey_pb2.Survey(
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
                

            return survey_pb2.GetSurveysResponse(survey=res)
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        logger.error(str(e))
    
    return Empty()  
