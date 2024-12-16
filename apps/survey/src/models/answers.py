from sqlalchemy import (
    Column, BigInteger, TIMESTAMP, Boolean, ForeignKey, text
)
from config.db import Base

class Answer(Base):
    __tablename__ = 'answers'
    __table_args__ = {'extend_existing': True}

    

    def __repr__(self):
        return f"<Answer(id={self.id}, question_id={self.question_id}, answer_variant_id={self.answer_variant_id}, content={self.content}, created_by={self.created_by}, priority={self.priority}, t_created_at={self.t_created_at}, t_updated_at={self.t_updated_at}, t_deleted={self.t_deleted})>"
