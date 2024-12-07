from pydantic import BaseModel
from typing import Optional

class UpdateSurveyRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
