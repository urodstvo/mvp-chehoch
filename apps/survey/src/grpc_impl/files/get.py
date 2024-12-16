
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.files import File 

from google.protobuf.timestamp_pb2 import Timestamp
from config.logger import logger

import survey_pb2
def GetFile(request, context: ServicerContext):
    try:
        with Session() as session:
            file = session.query(File).filter(File.id == request.file_id, File.t_deleted == False).first()
            if file is None:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("File not found")
                return survey_pb2.GetFileResponse()
            
            t_created_at = Timestamp()
            t_created_at.FromDatetime(file.t_created_at)
            t_updated_at = Timestamp()
            t_updated_at.FromDatetime(file.t_updated_at)
            
            return survey_pb2.GetFileResponse(file=survey_pb2.File(
                id=file.id,
                filename=file.filename,
                mime_type=file.mime_type,
                mem_size=file.mem_size,
                user_id=file.user_id,
                t_created_at=t_created_at,
                t_updated_at=t_updated_at,
                t_deleted=file.t_deleted
            ))
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))
        logger.error(str(e))

    return survey_pb2.GetFileResponse()
