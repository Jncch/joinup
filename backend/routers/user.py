from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
import psycopg2

router = APIRouter()

# Pydanticモデル
class UserBase(BaseModel):
    email: str
    name: str
    user_type: str
    avatar_url: Optional[str] = None

class FreelancerProfileBase(BaseModel):
    skills: List[str]
    experience_years: int
    availability: str
    bio: str
    location: str
    hourly_rate: int
    remote_ok: bool = True

class CommunityProfileBase(BaseModel):
    community_type: str
    activity_description: str
    target_audience: str
    location: str
    member_count: int = 0

@router.get("/")
async def get_users(db: Session = Depends(get_db)):
    """全ユーザー取得（モック用）"""
    try:
        cursor = db.connection().connection.cursor()
        cursor.execute("""
            SELECT u.id, u.email, u.name, u.user_type, u.avatar_url, u.created_at
            FROM users u
            ORDER BY u.created_at DESC
        """)
        users = []
        for row in cursor.fetchall():
            users.append({
                "id": row[0],
                "email": row[1],
                "name": row[2],
                "user_type": row[3],
                "avatar_url": row[4],
                "created_at": row[5]
            })
        cursor.close()
        return {"users": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/freelancers")
async def get_freelancers(db: Session = Depends(get_db)):
    """フリーランサー一覧取得"""
    try:
        cursor = db.connection().connection.cursor()
        cursor.execute("""
            SELECT u.id, u.name, u.avatar_url, fp.skills, fp.experience_years, 
                   fp.availability, fp.bio, fp.location, fp.hourly_rate
            FROM users u
            JOIN freelancer_profiles fp ON u.id = fp.user_id
            WHERE u.user_type = 'freelancer'
            ORDER BY u.created_at DESC
        """)
        freelancers = []
        for row in cursor.fetchall():
            freelancers.append({
                "id": row[0],
                "name": row[1],
                "avatar_url": row[2],
                "skills": row[3] or [],
                "experience_years": row[4],
                "availability": row[5],
                "bio": row[6],
                "location": row[7],
                "hourly_rate": row[8]
            })
        cursor.close()
        return {"freelancers": freelancers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/communities")
async def get_communities(db: Session = Depends(get_db)):
    """コミュニティ一覧取得"""
    try:
        cursor = db.connection().connection.cursor()
        cursor.execute("""
            SELECT u.id, u.name, u.avatar_url, cp.community_type, 
                   cp.activity_description, cp.target_audience, cp.location, cp.member_count
            FROM users u
            JOIN community_profiles cp ON u.id = cp.user_id
            WHERE u.user_type = 'community'
            ORDER BY u.created_at DESC
        """)
        communities = []
        for row in cursor.fetchall():
            communities.append({
                "id": row[0],
                "name": row[1],
                "avatar_url": row[2],
                "community_type": row[3],
                "activity_description": row[4],
                "target_audience": row[5],
                "location": row[6],
                "member_count": row[7]
            })
        cursor.close()
        return {"communities": communities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}")
async def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """ユーザープロフィール取得"""
    try:
        cursor = db.connection().connection.cursor()
        cursor.execute("""
            SELECT u.id, u.email, u.name, u.user_type, u.avatar_url
            FROM users u WHERE u.id = %s
        """, (user_id,))
        
        user_row = cursor.fetchone()
        if not user_row:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = {
            "id": user_row[0],
            "email": user_row[1],
            "name": user_row[2],
            "user_type": user_row[3],
            "avatar_url": user_row[4]
        }
        
        # プロフィール情報の取得
        if user["user_type"] == "freelancer":
            cursor.execute("""
                SELECT skills, experience_years, availability, bio, location, hourly_rate, remote_ok
                FROM freelancer_profiles WHERE user_id = %s
            """, (user_id,))
            profile_row = cursor.fetchone()
            if profile_row:
                user["profile"] = {
                    "skills": profile_row[0] or [],
                    "experience_years": profile_row[1],
                    "availability": profile_row[2],
                    "bio": profile_row[3],
                    "location": profile_row[4],
                    "hourly_rate": profile_row[5],
                    "remote_ok": profile_row[6]
                }
        elif user["user_type"] == "community":
            cursor.execute("""
                SELECT community_type, activity_description, target_audience, location, member_count
                FROM community_profiles WHERE user_id = %s
            """, (user_id,))
            profile_row = cursor.fetchone()
            if profile_row:
                user["profile"] = {
                    "community_type": profile_row[0],
                    "activity_description": profile_row[1],
                    "target_audience": profile_row[2],
                    "location": profile_row[3],
                    "member_count": profile_row[4]
                }
        
        cursor.close()
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))