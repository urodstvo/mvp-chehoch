from datetime import datetime
from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.surveys import File 

def UpdateSurvey(request, context: ServicerContext):
    try:
        with Session() as session:
            survey = session.query(File).filter(File.id == request.survey_id, File.t_deleted == False).first()
            if survey is None:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Survey not found")
                return Empty()  
            
            if request.name:
                survey.name = request.name
                
            if request.description:
                survey.description = request.description
            
            survey.updated_at = datetime.now()

            session.commit()
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(f"Error: {str(e)}")

    return Empty()
