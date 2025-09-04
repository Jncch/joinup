from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, communities, matching

app = FastAPI(title="JoinUp API", description="フリーランスとコミュニティのマッチングAPI", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターの登録
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(communities.router, prefix="/api/communities", tags=["communities"])
app.include_router(matching.router, prefix="/api/matching", tags=["matching"])

@app.get("/")
async def root():
    return {"message": "JoinUp API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}