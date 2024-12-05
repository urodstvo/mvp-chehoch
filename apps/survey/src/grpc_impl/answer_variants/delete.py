from datetime import datetime
from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from sqlalchemy import update
from src.models.answer_variants import AnswerVariant 

def DeleteAnswerVariant(request, context: ServicerContext):
    
    try:
        with Session() as session:
            stmt = (
                update(AnswerVariant)
                .where(AnswerVariant.id == request.answer_variant_id)
                .values(
                    t_deleted=True,
                    t_updated_at=datetime.now()
                )
            )
            
            result = session.execute(stmt)
            session.commit()

            if result.rowcount == 0:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("AnswerVariant not found")
                return Empty()
            
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
