from datetime import datetime
from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.answer_variants import AnswerVariant 

def UpdateAnswerVariant(request, context: ServicerContext):
    try:
        with Session() as session:
            if request.answer_variant_id:
                answer_variant = session.query(AnswerVariant).filter(
                    AnswerVariant.id == request.answer_variant_id, 
                    AnswerVariant.question_id == request.question_id, 
                    AnswerVariant.t_deleted == False
                ).first()

                answer_variant.content = request.content   
                answer_variant.t_updated_at = datetime.now()      

            else:
                new = AnswerVariant(
                    question_id=request.question_id,
                    content=request.content,
                )

                session.add(new)  
            
            
            session.commit()
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(f"Error: {str(e)}")

    return Empty()
