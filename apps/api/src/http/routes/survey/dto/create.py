from pydantic import BaseModel

class CreateSurveyRequest(BaseModel):
    organisation_id: int
