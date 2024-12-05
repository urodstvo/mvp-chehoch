from typing import List
from fastapi import APIRouter, Depends

from src.middleware import check_session
from src.models import Answer

from .get_for_question import get_question_answers

router = APIRouter(prefix="/answer")
router.dependencies = [Depends(check_session)]

router.get("/{question_id}", response_model=List[Answer])(get_question_answers)