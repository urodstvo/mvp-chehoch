from fastapi import APIRouter, Depends


from src.middeware import check_session

from .get_me import get_user_from_session
from .update import update_user
from .dto import UserWithProfile


router = APIRouter(prefix="/user")
router.dependencies = [Depends(check_session)]

router.get("/me", response_model=UserWithProfile)(get_user_from_session)
router.patch("/me")(update_user)



