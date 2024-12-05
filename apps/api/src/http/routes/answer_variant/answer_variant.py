from typing import List
from fastapi import APIRouter, Depends

from src.middleware import check_session
from src.models import AnswerVariant

from .get_for_question import get_question_answer_variants
from .create import create_answer_variant
from .update import update_answer_variant
from .delete import delete_answer_variant

router = APIRouter(prefix="/answer-variant")
router.dependencies = [Depends(check_session)]

router.post("/")(create_answer_variant)
router.get("/{question_id}", response_model=List[AnswerVariant])(get_question_answer_variants)
router.patch("/{answer_variant_id}")(update_answer_variant)
router.delete("/{answer_variant_id}")(delete_answer_variant)