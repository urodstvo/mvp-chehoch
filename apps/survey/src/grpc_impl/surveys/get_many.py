from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from models.surveys import Survey
from libs.grpc.__generated__.survey_pb2 import GetSurveysResponse, Survey as SurveyMessage

def GetSurveys(request, context: ServicerContext):
    try:
        if not request.survey_ids:
            context.set_code(StatusCode.INVALID_ARGUMENT)
            context.set_details("Survey ids not found")
            return Empty()  

        with Session() as session:
            surveys = session.query(Survey).filter(Survey.id.in_(request.survey_ids), Survey.t_deleted == False).all()

            if not surveys:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Surveys not found")
                return Empty()

            surveys_response = [
                SurveyMessage(
                    id=survey.id,
                    name=survey.name,
                    description=survey.description,
                    questions_amount=survey.questions_amount,
                    answers_amount=survey.answers_amount,
                    organisation_id=survey.organisation_id,
                    created_by=survey.created_by,
                    t_created_at=str(survey.t_created_at),  
                    t_updated_at=str(survey.t_updated_at),  
                    t_deleted=survey.t_deleted
                )
                for survey in surveys
            ]

            return GetSurveysResponse(survey=surveys_response)
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
    
    return Empty()  
