
from sqlalchemy import (
     Column, BigInteger, SmallInteger, Boolean, ForeignKey, TIMESTAMP, text
)
from config.db import Base

class Survey(Base):
    __tablename__ = 'surveys'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    questions_amount = Column(SmallInteger, nullable=True)
    answers_amount = Column(BigInteger, nullable=True)
    created_by = Column(BigInteger, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    organisation_id = Column(BigInteger, ForeignKey('organisations.id', ondelete='CASCADE'), nullable=True)
    t_created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    t_updated_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    t_deleted = Column(Boolean, server_default=text('FALSE'), nullable=False)

    def __repr__(self):
        return f"<Survey(id={self.id}, created_by={self.created_by}, organisation_id={self.organisation_id},
            questions_amount={self.questions_amount}, answers_amount={self.answers_amount}, 
            t_created_at={self.t_created_at}, t_updated_at={self.t_updated_at}, t_deleted={self.t_deleted}) >"