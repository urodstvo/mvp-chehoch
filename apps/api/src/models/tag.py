from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from google.protobuf.timestamp_pb2 import Timestamp

class Tag(BaseModel):
    id: int
    name: str
    t_created_at: datetime
    t_updated_at: datetime
    t_deleted: bool

    class Config:
        from_attributes = True

    @staticmethod
    def timestamp_to_datetime(value: Optional[Timestamp]) -> Optional[datetime]:
        return value.ToDatetime() if value else None