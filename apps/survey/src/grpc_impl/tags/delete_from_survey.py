from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from models.survey_tags import SurveyTag
from datetime import datetime

def DeleteTagsFromSurvey(request, context: ServicerContext):
    try:
        with Session() as session:
            updated_count = (
                session.query(SurveyTag)
                .filter(
                    SurveyTag.survey_id == request.survey_id,
                    SurveyTag.tag_id.in_(request.tags)
                )
                .update({"t_deleted": True, "t_updated_at": datetime.now()}, synchronize_session=False)
            )
            
            # Если ничего не обновлено, возвращаем статус NOT_FOUND
            if updated_count == 0:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details("No matching tags found for the specified survey.")
                return Empty()

            session.commit()
    
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
