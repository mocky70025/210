# server/Dockerfile
FROM node:20-slim

# ネイティブ拡張のビルドに必要（better-sqlite3 など）
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 依存関係を先に入れる
COPY package*.json ./
RUN npm ci

# 残りのソース
COPY . .

# TypeScript ビルド
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Koyeb の Volume を /var/lib/minigame にマウントし、
# 環境変数で参照する（Koyeb 側で設定）
CMD ["node", "dist/index.js"]

