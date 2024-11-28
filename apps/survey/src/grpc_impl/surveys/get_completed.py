from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from models.surveys import Survey
from models.users_surveys import UserSurvey
from libs.grpc.__generated__.survey_pb2 import GetCompletedSurveysResponse, Survey as SurveyMessage

def GetCompletedSurveys(request, context: ServicerContext):
    try:
        with Session() as session:
            completed_surveys = session.query(UserSurvey).filter(UserSurvey.user_id == request.user_id).all()
            if not completed_surveys:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Completed surveys not found")
                return Empty()

            surveys = session.query(Survey).filter(Survey.id.in_([survey.survey_id for survey in completed_surveys]), Survey.t_deleted == False).all()
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

            return GetCompletedSurveysResponse(survey=surveys_response)
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
    
    return Empty()  
