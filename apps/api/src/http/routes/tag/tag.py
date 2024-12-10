from fastapi import APIRouter, Depends

from src.middleware import check_session
from src.models import Tag
from typing import List

from .get_for_survey import get_survey_tags
from .get_for_user import get_user_tags
from .add_to_user import add_to_user
from .add_to_survey import add_to_survey
from .delete_from_user import delete_from_user
from .get_all import get_all_tags
from .delete_from_survey import delete_from_survey



router = APIRouter(prefix="/tag", tags=["Tag"])
router.dependencies = [Depends(check_session)]

router.get("/")(get_all_tags)
router.get("/survey/{survey_id}", response_model=List[Tag])(get_survey_tags)
router.get("/user", response_model=List[Tag])(get_user_tags)
router.post("/survey/{survey_id}")(add_to_survey)
router.post("/user")(add_to_user)
router.delete("/survey/{survey_id}")(delete_from_survey)
router.delete("/user")(delete_from_user)