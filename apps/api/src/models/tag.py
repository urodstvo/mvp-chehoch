from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Tag(BaseModel):
    id: int
    name: str
    t_created_at: datetime
    t_updated_at: datetime
    t_deleted: bool
