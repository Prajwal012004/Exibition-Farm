from sqlalchemy import Column, Integer, String
from .database import Base


class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String, nullable=False)
    name_mr = Column(String, nullable=False)
    meta_en = Column(String, nullable=False)
    meta_mr = Column(String, nullable=False)
    price_in_rupees = Column(Integer, nullable=False)