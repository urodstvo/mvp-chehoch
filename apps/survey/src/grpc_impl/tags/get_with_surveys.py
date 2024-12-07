from grpc import ServicerContext, StatusCode
from config.logger import logger
from config.db import Session

from src.models.survey_tags import SurveyTag
from google.protobuf.empty_pb2 import Empty

import survey_pb2


def GetSurveysWithTagsIds(request, context: ServicerContext):
    try:
        with Session() as session:
            # Поиск вопросов для заданного опроса
            tags = session.query(SurveyTag).filter(SurveyTag.t_deleted == False).all()

            if not tags:
                context.set_code(StatusCode.NOT_FOUND)
                context.set_details(f"No tags found")
                return Empty()

            res = []
            for tag in tags:
                res.append(survey_pb2.SurveyWithTagId(survey_id=tag.survey_id, tag_id=tag.tag_id))

            return survey_pb2.GetSurveysWithTagsIdsResponse(survey_with_tag_ids=tags)

    except Exception as e:
        context.set_code(StatusCode.INTERNAL)
        context.set_details(f"Error: {str(e)}")
        logger.error(f"Error in GetSurveysWithTagsIds: {str(e)}")