from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class File(BaseModel):
    id: Optional[int]  
    filename: str  
    mime_type: Optional[str] = None 
    mem_size: Optional[int] = None  
    user_id: Optional[int] = None  
    t_created_at: Optional[datetime] = None  
    t_updated_at: Optional[datetime] = None 
    t_deleted: Optional[bool] = False  

    class Config:
        from_attributes = True  # if you plan to use it with ORM models
