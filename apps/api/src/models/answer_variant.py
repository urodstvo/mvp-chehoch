from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import StringValue, Int32Value, Int64Value



class AnswerVariant(BaseModel):
    id: int
    question_id: int
    content: str
    t_created_at: datetime
    t_updated_at: datetime
    t_deleted: bool

    @staticmethod
    def timestamp_to_datetime(value: Optional[Timestamp]) -> Optional[datetime]:
        return value.ToDatetime() if value else None
    

    @staticmethod
    def string_value_to_str(value: Optional[StringValue]) -> Optional[str]:
        return value.value if value else None
