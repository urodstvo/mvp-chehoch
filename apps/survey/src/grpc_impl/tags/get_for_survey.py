from google.protobuf.empty_pb2 import Empty
from google.protobuf.timestamp_pb2 import Timestamp
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.survey_tags import SurveyTag
from src.models.tags import Tag
import survey_pb2

def GetSurveyTags(request, context: ServicerContext):
    try:
        with Session() as session:
            tags = session.query(SurveyTag, Tag).join(
                Tag, Tag.id == SurveyTag.tag_id
            ).filter(
                SurveyTag.survey_id == request.survey_id,
                SurveyTag.t_deleted == False,
                Tag.t_deleted == False
            ).all()

            if not tags:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details(f"No tags found for survey ID {request.survey_id}")
                return Empty()
            
            survey_tags = []
            for _, tag in tags:
                t_created_at = Timestamp()
                t_created_at.FromDatetime(tag.t_created_at)
                t_updated_at = Timestamp()
                t_updated_at.FromDatetime(tag.t_updated_at)
                
                survey_tags.append( survey_pb2.Tag(
                    id=tag.id,
                    name=tag.name,
                    t_created_at=t_created_at,
                    t_updated_at=t_updated_at,
                    t_deleted=tag.t_deleted,
                    )
                )
                

            return survey_pb2.GetSurveyTagsResponse(tags=survey_tags)

    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
