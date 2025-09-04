from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db

router = APIRouter()

class MatchRequest(BaseModel):
    freelancer_id: int
    community_id: int
    message: Optional[str] = None

@router.post("/")
async def create_match(match_request: MatchRequest, db: Session = Depends(get_db)):
    """マッチングリクエスト作成"""
    try:
        cursor = db.connection().connection.cursor()
        cursor.execute("""
            INSERT INTO matches (freelancer_id, community_id, message, status)
            VALUES (%s, %s, %s, 'pending')
            RETURNING id
        """, (match_request.freelancer_id, match_request.community_id, match_request.message))
        
        match_id = cursor.fetchone()[0]
        db.commit()
        cursor.close()
        
        return {"match_id": match_id, "status": "pending", "message": "マッチングリクエストを送信しました"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_matches(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    """マッチング一覧取得"""
    try:
        cursor = db.connection().connection.cursor()
        
        if user_id:
            cursor.execute("""
                SELECT m.id, m.freelancer_id, m.community_id, m.status, m.message, m.created_at,
                       f.name as freelancer_name, f.avatar_url as freelancer_avatar,
                       c.name as community_name, c.avatar_url as community_avatar
                FROM matches m
                JOIN users f ON m.freelancer_id = f.id
                JOIN users c ON m.community_id = c.id
                WHERE m.freelancer_id = %s OR m.community_id = %s
                ORDER BY m.created_at DESC
            """, (user_id, user_id))
        else:
            cursor.execute("""
                SELECT m.id, m.freelancer_id, m.community_id, m.status, m.message, m.created_at,
                       f.name as freelancer_name, f.avatar_url as freelancer_avatar,
                       c.name as community_name, c.avatar_url as community_avatar
                FROM matches m
                JOIN users f ON m.freelancer_id = f.id
                JOIN users c ON m.community_id = c.id
                ORDER BY m.created_at DESC
            """)
        
        matches = []
        for row in cursor.fetchall():
            matches.append({
                "id": row[0],
                "freelancer_id": row[1],
                "community_id": row[2],
                "status": row[3],
                "message": row[4],
                "created_at": row[5],
                "freelancer": {
                    "name": row[6],
                    "avatar_url": row[7]
                },
                "community": {
                    "name": row[8],
                    "avatar_url": row[9]
                }
            })
        
        cursor.close()
        return {"matches": matches}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
