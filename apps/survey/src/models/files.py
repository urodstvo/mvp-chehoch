from sqlalchemy import (
    Column, BigInteger, TIMESTAMP, Boolean, ForeignKey, text
)
from config.db import Base

class File(Base):
    __tablename__ = 'files'
    __table_args__ = {'extend_existing': True}


    def __repr__(self):
        return f"<File(id={self.id}, filename={self.filename}, mime_type={self.mime_type}, mem_size={self.mem_size}, user_id={self.user_id}, t_created_at={self.t_created_at}, t_updated_at={self.t_updated_at}, t_deleted={self.t_deleted})>"
