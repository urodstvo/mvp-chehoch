from fastapi import APIRouter

from .login import login
from .register import register
from .logout import logout

router = APIRouter(prefix="/auth")

router.post("/login")(login)
router.post("/register")(register)
router.post("/logout")(logout)
