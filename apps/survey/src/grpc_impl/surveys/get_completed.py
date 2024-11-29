from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.surveys import Survey
from src.models.users_surveys import UserSurvey
import survey_pb2


from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import StringValue

def GetCompletedSurveys(request, context: ServicerContext):
    try:
        with Session() as session:
            completed_surveys = session.query(UserSurvey).filter(UserSurvey.user_id == request.user_id).all()
            if len(completed_surveys) == 0:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Completed surveys not found")
                return Empty()

            surveys = session.query(Survey).filter(Survey.id.in_([survey.survey_id for survey in completed_surveys]), Survey.t_deleted == False).all()
            if len(surveys) == 0:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Surveys not found")
                return Empty()

            surveys_response = []
            for survey in surveys:
                t_created_at = Timestamp()
                t_created_at.FromDatetime(survey.t_created_at)
                t_updated_at = Timestamp()
                t_updated_at.FromDatetime(survey.t_updated_at)

                surveys_response.append(survey_pb2.Survey(
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

            return survey_pb2.GetCompletedSurveysResponse(survey=surveys_response)
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
    
    return Empty()  
