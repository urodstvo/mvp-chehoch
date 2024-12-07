from datetime import datetime
from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from sqlalchemy import update
from src.models.surveys import File 

def DeleteSurvey(request, context: ServicerContext):
    try:
        with Session() as session:
            stmt = (
                update(File)
                .where(File.id == request.survey_id)
                .values(
                    t_deleted=True,
                    t_updated_at=datetime.now()
                )
            )
            
            result = session.execute(stmt)
            session.commit()

            if result.rowcount == 0:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("Survey not found")
                return Empty()
            
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
