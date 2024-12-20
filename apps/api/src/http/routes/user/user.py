from fastapi import APIRouter, Depends


from src.middleware import check_session

from .get_me import get_user_from_session
from .update import update_user
from .dto.get_me import UserWithProfile


router = APIRouter(prefix="/user", tags=["User"])
router.dependencies = [Depends(check_session)]

router.get("/me", response_model=UserWithProfile)(get_user_from_session)
router.patch("/me")(update_user)



