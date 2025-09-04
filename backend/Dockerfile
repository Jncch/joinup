FROM python:3.11-slim

WORKDIR /app

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Python依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 開発用追加パッケージ
RUN pip install black flake8 isort pytest pytest-asyncio httpx

# ソースコードをコピー
COPY . .

# ポート8000を公開
EXPOSE 8000

# 開発サーバーを起動（ホットリロード有効）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]