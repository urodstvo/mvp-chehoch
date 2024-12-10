from google.protobuf.empty_pb2 import Empty
from google.protobuf.timestamp_pb2 import Timestamp
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.survey_tags import SurveyTag
from src.models.tags import Tag
import survey_pb2

def GetAllTags(request, context: ServicerContext):
    try:
        with Session() as session:
            tags = session.query(Tag).filter(Tag.t_deleted == False).all()

            if not tags:
                return survey_pb2.GetAllTagsResponse(tags=[])
            
            res = []
            for tag in tags:
                t_created_at = Timestamp()
                t_created_at.FromDatetime(tag.t_created_at)
                t_updated_at = Timestamp()
                t_updated_at.FromDatetime(tag.t_updated_at)
                
                res.append(survey_pb2.Tag(
                    id=tag.id,
                    name=tag.name,
                    t_created_at=t_created_at,
                    t_updated_at=t_updated_at,
                    t_deleted=tag.t_deleted,
                ))
                

            return survey_pb2.GetAllTagsResponse(tags=res)

    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
