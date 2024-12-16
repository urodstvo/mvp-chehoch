from fastapi import HTTPException

import survey_pb2
from src.clients import SurveyServiceClient


def delete_question_image(question_id: int):
    try: 
        SurveyServiceClient.DeleteQuestionImage(survey_pb2.DeleteQuestionImageRequest(question_id=question_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete question image: {str(e)}")