from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from google.protobuf.timestamp_pb2 import Timestamp
from google.protobuf.wrappers_pb2 import StringValue, Int32Value, Int64Value

class Organisation(BaseModel):
    id: int
    name: str
    supervisor: int
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    web_site: Optional[str] = None
    inn: Optional[str] = None
    t_created_at: Optional[datetime] = None
    t_updated_at: Optional[datetime] = None
    t_deleted: bool = False
    logo: Optional[int] = None
    logo_url: Optional[str] = None

    class Config:
        from_attributes = True  # Optional: allows compatibility with ORM models (if using ORM)
    
    # Convert StringValue to string
    @staticmethod
    def string_value_to_str(value: Optional[StringValue]) -> Optional[str]:
        return value.value if value else None
    
    @staticmethod
    def int32_value_to_int(value: Optional[Int32Value]) -> Optional[int]:
        return value.value if value else None
    @staticmethod
    def int64_value_to_int(value: Optional[Int64Value]) -> Optional[int]:
        return value.value if value else None


    # Convert Timestamp to datetime
    @staticmethod
    def timestamp_to_datetime(value: Optional[Timestamp]) -> Optional[datetime]:
        return value.ToDatetime() if value else None
