from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.files import File 
from config.logger import logger

import survey_pb2

def CreateFile(request, context: ServicerContext):
    try:
        with Session() as session:
            new_file = File(
                filename=request.filename,
                mime_type=request.mime_type,
                mem_size=request.mem_size,
                user_id=request.user_id
            )
            session.add(new_file)
            session.commit()

            return survey_pb2.CreateFileResponse(file_id=new_file.id)
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        logger.error(str(e))

    return Empty()
