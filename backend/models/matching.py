from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    freelancer_id = Column(Integer, index=True)
    community_id = Column(Integer, index=True)
    status = Column(String, default="pending")  # pending, accepted, rejected, completed
    message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, index=True)
    sender_id = Column(Integer, index=True)
    content = Column(Text)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, index=True)
    reviewer_id = Column(Integer, index=True)
    reviewee_id = Column(Integer, index=True)
    rating = Column(Integer)  # 1-5
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())