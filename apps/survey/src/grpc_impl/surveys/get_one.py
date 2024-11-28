
from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from models.surveys import Survey 
from libs.grpc.__generated__.survey_pb2 import GetSurveyResponse, Survey as SurveyMessage

def GetSurvey(request, context: ServicerContext):
    try:
        with Session() as session:
            survey = session.query(Survey).filter(Survey.id == request.survey_id, Survey.t_deleted == False).first()
            if survey is None:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Survey not found")
                return Empty()

           
            return GetSurveyResponse(
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
            )
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
