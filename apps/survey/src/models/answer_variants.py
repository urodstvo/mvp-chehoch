from sqlalchemy import (
    Column, BigInteger, TIMESTAMP, Boolean, ForeignKey, text
)
from config.db import Base

class AnswerVariant(Base):
    __tablename__ = 'answer_variants'
    __table_args__ = {'extend_existing': True}

    

    def __repr__(self):
        return f"<AnswerVariant(id={self.id}, question_id={self.question_id}, content={self.content}, t_created_at={self.t_created_at}, t_updated_at={self.t_updated_at}, t_deleted={self.t_deleted})>"
