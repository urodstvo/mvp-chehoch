from typing import List
from fastapi import APIRouter, Depends

from src.middleware import check_session
from src.models import Question

from .get_for_survey import get_survey_questions
from .create import create_question
from .update import update_question
from .delete import delete_question
from .complete import complete_question
from .delete_image import delete_question_image


router = APIRouter(prefix="/question", tags=["Question"])
router.dependencies = [Depends(check_session)]

router.post("/")(create_question)
router.post("/{question_id}/complete")(complete_question)
router.get("/{survey_id}", response_model=List[Question])(get_survey_questions)
router.patch("/{question_id}")(update_question)
router.delete("/{question_id}/image")(delete_question_image)
router.delete("/{question_id}")(delete_question)