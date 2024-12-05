from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import StringValue,Int32Value


class Question(BaseModel):
    id: int
    survey_id: int
    type: Optional[str] = None
    content: Optional[str] = None
    answers_amount: int
    t_created_at: datetime
    t_updated_at: datetime
    t_deleted: bool
    image: Optional[int] = None
    image_url: Optional[str] = None


    class Config:
        from_attributes = True  # Optional: allows compatibility with ORM models (if using ORM)
    
    # Convert StringValue to string
    @staticmethod
    def string_value_to_str(value: Optional[StringValue]) -> Optional[str]:
        return value.value if value else None
    
    @staticmethod
    def int32_value_to_int(value: Optional[Int32Value]) -> Optional[int]:
        return value.value if value else None

    # Convert Timestamp to datetime
    @staticmethod
    def timestamp_to_datetime(value: Optional[Timestamp]) -> Optional[datetime]:
        return value.ToDatetime() if value else None