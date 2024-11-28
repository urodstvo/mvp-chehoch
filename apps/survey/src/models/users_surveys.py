from sqlalchemy import (
     Column, BigInteger,  Boolean, ForeignKey, TIMESTAMP, text
)
from config.db import Base

class UserSurvey(Base):
    __tablename__ = 'users_surveys'

    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    survey_id = Column(BigInteger, ForeignKey('surveys.id', ondelete='CASCADE'), primary_key=True)
    t_created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    t_updated_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    t_deleted = Column(Boolean, server_default=text('FALSE'), nullable=False)

    def __repr__(self):
        return f"<UserSurvey(user_id={self.user_id}, survey_id={self.survey_id}, t_created_at={self.t_created_at}, t_updated_at={self.t_updated_at}, t_deleted={self.t_deleted})>"
