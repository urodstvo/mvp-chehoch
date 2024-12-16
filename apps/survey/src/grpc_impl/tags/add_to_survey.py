from google.protobuf.empty_pb2 import Empty
from grpc import ServicerContext, StatusCode
from config.db import Session
from src.models.survey_tags import SurveyTag

def AddTagsToSurvey(request, context: ServicerContext):
    try:
        with Session() as session:
            existing_tags = (
                session.query(SurveyTag)
                .filter(
                    SurveyTag.survey_id == request.survey_id,
                    SurveyTag.tag_id.in_(request.tags),
                    SurveyTag.t_deleted == True
                )
                .all()
            )

            if existing_tags:
                session.query(SurveyTag).filter(
                    SurveyTag.survey_id == request.survey_id,
                    SurveyTag.tag_id.in_(request.tags),
                    SurveyTag.t_deleted == True
                ).update({"t_deleted": False}, synchronize_session=False)


            existing_records = (
                session.query(SurveyTag)
                .filter(SurveyTag.survey_id == request.survey_id, SurveyTag.tag_id.in_(request.tags), SurveyTag.t_deleted == False)
                .all()
            )
            existing_tag_ids = {record.tag_id for record in existing_records}

            new_tags = [
                SurveyTag(survey_id=request.survey_id, tag_id=tag_id)
                for tag_id in request.tags
                if tag_id not in existing_tag_ids
            ]

            if new_tags:
                session.bulk_save_objects(new_tags)  # Эффективно добавляем сразу все

            session.commit()
    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(str(e))

    return Empty()
