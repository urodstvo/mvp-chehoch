from fastapi import APIRouter, Depends

from src.middleware import check_session
from src.models import Survey
from typing import List

from .dto.get_report import GetSurveyReportResponse
from .dto.get import GetSurveyResponse

from .create import create_survey
from .update import update_survey
from .get_one import get_survey
from .get_feed import get_survey_feed
from .delete import delete_survey
from .complete import complete_survey
from .get_completed import get_completed_surveys
from .get_for_organisation import get_organisation_surveys

from .get_report import get_survey_report

router = APIRouter(prefix="/survey", tags=["Survey"])
router.dependencies = [Depends(check_session)]

router.post("/")(create_survey)
router.get("/completed", response_model=List[GetSurveyResponse])(get_completed_surveys)
router.get("/feed", response_model=List[GetSurveyResponse])(get_survey_feed)
router.get("/organisation/{organisation_id}", response_model=List[GetSurveyResponse])(get_organisation_surveys)
router.get("/{survey_id}", response_model=GetSurveyResponse)(get_survey)
router.patch("/{survey_id}")(update_survey)
router.delete("/{survey_id}")(delete_survey)
router.post("/complete/{survey_id}")(complete_survey)

router.get('/{survey_id}/report', response_model=GetSurveyReportResponse)(get_survey_report)