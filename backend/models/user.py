from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ARRAY
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    user_type = Column(String)  # 'freelancer' or 'community'
    name = Column(String)
    avatar_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class FreelancerProfile(Base):
    __tablename__ = "freelancer_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    skills = Column(ARRAY(String))
    experience_years = Column(Integer)
    availability = Column(String)
    preferred_communities = Column(ARRAY(String))
    portfolio_url = Column(String)
    github_url = Column(String)
    hourly_rate = Column(Integer)
    bio = Column(Text)
    location = Column(String)
    remote_ok = Column(Boolean, default=True)

class CommunityProfile(Base):
    __tablename__ = "community_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    community_type = Column(String)
    activity_description = Column(Text)
    regular_events = Column(ARRAY(String))
    target_audience = Column(Text)
    requirements = Column(ARRAY(String))
    location = Column(String)
    website_url = Column(String)
    member_count = Column(Integer, default=0)
    meeting_frequency = Column(String)