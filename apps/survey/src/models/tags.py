from sqlalchemy import (
     Column, BigInteger,  Boolean, String, TIMESTAMP, text
)
from config.db import Base

class Tag(Base):
    __tablename__ = 'tags'
    __table_args__ = {'extend_existing': True}

    # id = Column(BigInteger, primary_key=True, autoincrement=True)
    # name = Column(String(256), nullable=False, unique=True)
    # t_created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    # t_updated_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    # t_deleted = Column(Boolean, server_default=text('FALSE'), nullable=False)

    def __repr__(self):
        return f"<Tag(id={self.id}, name={self.name}, t_created_at={self.t_created_at}, t_updated_at={self.t_updated_at}, t_deleted={self.t_deleted})>"
