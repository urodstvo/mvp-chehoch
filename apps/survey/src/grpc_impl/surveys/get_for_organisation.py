from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.surveys import File
import survey_pb2


from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import StringValue

def GetOrganisationSurveys(request, context: ServicerContext):
    try:
        with Session() as session:
            surveys = session.query(File).filter(File.organisation_id==request.organisation_id, File.t_deleted == False).all()

            if not surveys:
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

            return survey_pb2.GetOrganisationSurveysResponse(survey=surveys_response)
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
    
    return Empty()  
