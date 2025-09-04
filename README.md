# Dockerインストール（Mac用）
下記、どっちか実行
- brew install docker
- arch -arm64 brew install docker

- brew install docker-compose
- arch -arm64 brew install docker-compose


# Colimaインストール（Mac用）
- brew install colima
- arch -arm64 brew install colima


# Colima起動
- colima start
- colima start --cpu 4 --memory 8　# メモリ指定バージョン


# プロジェクトフォルダ構成
joinup/
├── README.md
├── docker-compose.yml          # Docker Compose設定
├── init.sql                    # データベース初期化
├── frontend/                   # Next.jsフロントエンド
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── app/                # App Router
│       │   ├── layout.js       # 共通レイアウト
│       │   ├── page.js         # トップページ
│       │   ├── register/       # ユーザー登録
│       │   ├── matching/       # マッチング・検索
│       │   ├── profile/        # プロフィール表示
│       │   ├── mypage/         # マイページ
│       │   ├── freelancers/    # フリーランサー詳細
│       │   └── communities/    # コミュニティ詳細
│       ├── components/         # 共通コンポーネント
│       │   ├── Header.js
│       │   └── Footer.js
│       └── lib/
│           └── api.js          # APIクライアント
└── backend/                    # FastAPI バックエンド
    ├── Dockerfile
    ├── requirements.txt
    ├── main.py                 # FastAPIアプリケーション
    ├── database.py             # データベース設定
    ├── models/                 # データモデル
    │   ├── user.py
    │   └── matching.py
    └── routers/                # APIルーター
        ├── users.py
        ├── communities.py
        └── matching.py


# Docker操作
## アプリケーション起動
docker-compose up -d

## ログ確認
docker-compose logs -f [frontend|backend|db]

## アプリケーション停止
docker-compose down

## 完全リセット（ボリュームも削除）
docker-compose down -v

##  q 再ビルド
docker-compose up --build -d

## キャッシュクリア
docker system prune -f

## 実行確認
docker-compose ps


# API操作
## ヘルスチェック
curl http://localhost:8000/health

## フリーランサー一覧
curl http://localhost:8000/api/users/freelancers

## コミュニティ一覧
curl http://localhost:8000/api/users/communities

## 注目のコミュニティ
curl http://localhost:8000/api/communities/featured


# データベース操作
## データベース接続
docker-compose exec db psql -U joinup -d joinup_db

## テーブル確認
docker-compose exec db psql -U joinup -d joinup_db -c "\dt"

## サンプルデータ確認
docker-compose exec db psql -U joinup -d joinup_db -c "SELECT * FROM users;"


# Webリンク
http://localhost:3000