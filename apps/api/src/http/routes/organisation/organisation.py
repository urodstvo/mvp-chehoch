from typing import List
from fastapi import APIRouter, Depends

from .get_one import get_organisation
from .get_my import get_my_organisations
from .create import create_organisation
from .update import update_organisation
from .delete import delete_organisation

from src.middleware import check_session
from src.models import Organisation

router = APIRouter(prefix="/organisation", tags=["Organisation"])
router.dependencies = [Depends(check_session)]

router.post("/")(create_organisation)
router.get("/", response_model=List[Organisation])(get_my_organisations)
router.get("/{organisation_id}", response_model=Organisation)(get_organisation)
router.patch("/{organisation_id}")(update_organisation)
router.delete("/{organisation_id}")(delete_organisation)