from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from google.protobuf.wrappers_pb2 import Int32Value


class Answer(BaseModel):
    id: int
    question_id: int
    user_id: int
    answer_variant_id: int
    content: str
    priority: Optional[int] = None
    t_created_at: datetime
    t_updated_at: datetime
    t_deleted: bool

    class Config:
        from_attributes = True

    @staticmethod
    def int32_value_to_int(value: Optional[Int32Value]) -> Optional[int]:
        return value.value if value else None
