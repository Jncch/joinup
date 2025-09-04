from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db

router = APIRouter()

@router.get("/")
async def search_communities(
    keyword: Optional[str] = Query(None, description="検索キーワード"),
    community_type: Optional[str] = Query(None, description="コミュニティタイプ"),
    location: Optional[str] = Query(None, description="地域"),
    db: Session = Depends(get_db)
):
    """コミュニティ検索"""
    try:
        cursor = db.connection().connection.cursor()
        
        base_query = """
            SELECT u.id, u.name, u.avatar_url, cp.community_type, 
                   cp.activity_description, cp.target_audience, cp.location, cp.member_count
            FROM users u
            JOIN community_profiles cp ON u.id = cp.user_id
            WHERE u.user_type = 'community'
        """
        
        conditions = []
        params = []
        
        if keyword:
            conditions.append("(u.name ILIKE %s OR cp.activity_description ILIKE %s)")
            params.extend([f"%{keyword}%", f"%{keyword}%"])
        
        if community_type:
            conditions.append("cp.community_type ILIKE %s")
            params.append(f"%{community_type}%")
        
        if location:
            conditions.append("cp.location ILIKE %s")
            params.append(f"%{location}%")
        
        if conditions:
            base_query += " AND " + " AND ".join(conditions)
        
        base_query += " ORDER BY cp.member_count DESC"
        
        cursor.execute(base_query, params)
        
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
        return {"communities": communities, "total": len(communities)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/featured")
async def get_featured_communities(db: Session = Depends(get_db)):
    """注目のコミュニティ取得"""
    try:
        cursor = db.connection().connection.cursor()
        cursor.execute("""
            SELECT u.id, u.name, u.avatar_url, cp.community_type, 
                   cp.activity_description, cp.target_audience, cp.location, cp.member_count
            FROM users u
            JOIN community_profiles cp ON u.id = cp.user_id
            WHERE u.user_type = 'community'
            ORDER BY cp.member_count DESC
            LIMIT 6
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
        return {"featured_communities": communities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
