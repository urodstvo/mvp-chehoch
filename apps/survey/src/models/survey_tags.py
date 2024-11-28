from sqlalchemy import (
    Column, BigInteger, TIMESTAMP, Boolean, ForeignKey, text
)
from config.db import Base

class SurveyTag(Base):
    __tablename__ = 'surveys_tags'

    survey_id = Column(BigInteger, ForeignKey('surveys.id', ondelete='CASCADE'), primary_key=True)
    tag_id = Column(BigInteger, ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True)
    t_created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    t_updated_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    t_deleted = Column(Boolean, server_default=text('FALSE'), nullable=False)

    def __repr__(self):
        return f"<SurveyTag(survey_id={self.survey_id}, tag_id={self.tag_id}, t_created_at={self.t_created_at}, t_updated_at={self.t_updated_at}, t_deleted={self.t_deleted})>"
