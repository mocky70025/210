# デプロイ手順

このアプリケーションは、フロントエンドとバックエンドを別々のサービスにデプロイします。

## 構成

- **フロントエンド**: Vercel（完全無料）
- **バックエンド**: Render または Fly.io（完全無料、Socket.IO対応）

## 1. バックエンドのデプロイ（完全無料サービス）

### Render（推奨・最も簡単・CLI不要）

**完全無料プラン**:
- WebSocket対応
- スリープする可能性あり（15分間アクセスがないとスリープ、次回アクセス時に自動復帰）
- 無制限のデプロイ

**デプロイ手順**:

1. [Render](https://render.com/) にアカウントを作成・ログイン（GitHubアカウントで連携可能）
2. 「New +」→「Web Service」を選択
3. GitHubリポジトリ `mocky70025/210` を接続
4. 設定:
   - **Name**: `minigame-backend`（任意）
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. 環境変数を追加（「Environment」セクション）:
   - **Key**: `FRONTEND_URL`
   - **Value**: フロントエンドのURL（後で設定するVercelのURL、一時的に `http://localhost:5173` でも可）
   - **Key**: `PORT`
   - **Value**: `10000`（Renderのデフォルトポート）
6. 「Create Web Service」をクリック
7. デプロイ完了後、RenderのURLをメモ（例: `https://minigame-backend.onrender.com`）

**注意**: Renderの無料プランは15分間アクセスがないとスリープしますが、次回アクセス時に自動的に復帰します（初回復帰に30秒程度かかることがあります）。

### オプション2: Fly.io（推奨・スリープしない）

**完全無料プラン**:
- WebSocket対応
- **スリープしない**（常時稼働）
- 月間160時間のCPU時間（通常の使用では十分）
- 3つの共有CPU、256MB RAM

**デプロイ手順**:

1. [Fly.io](https://fly.io/) にアカウントを作成・ログイン
2. Fly CLIをインストール:
```bash
# macOS
curl -L https://fly.io/install.sh | sh

# または Homebrew
brew install flyctl
```
3. ログイン:
```bash
fly auth login
```
4. サーバーディレクトリに移動:
```bash
cd server
```
5. Flyアプリを初期化:
```bash
fly launch
```
   - アプリ名を入力（例: `minigame-backend`）
   - リージョンを選択（例: `nrt` - 東京）
   - PostgreSQLは不要なので「No」
6. `fly.toml` が作成されるので、確認・編集:
```toml
app = "minigame-backend"
primary_region = "nrt"

[build]

[env]
  PORT = "8080"
  FRONTEND_URL = "http://localhost:5173"  # 後で更新

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false  # スリープしないように
  auto_start_machines = true
  min_machines_running = 1
```
7. 環境変数を設定:
```bash
fly secrets set FRONTEND_URL=http://localhost:5173
# 後でVercelのURLに更新: fly secrets set FRONTEND_URL=https://your-app.vercel.app
```
8. デプロイ:
```bash
fly deploy
```
9. デプロイ完了後、Fly.ioのURLをメモ（例: `https://minigame-backend.fly.dev`）

### オプション3: Glitch（簡単だが制限あり）

**完全無料プラン**:
- WebSocket対応
- エディタ内で直接編集可能
- 5分間アクセスがないとスリープ

**デプロイ手順**:

1. [Glitch](https://glitch.com/) にアカウントを作成・ログイン
2. 「New Project」→「Import from GitHub」
3. リポジトリ `mocky70025/210` をインポート
4. `.env` ファイルを作成:
```
FRONTEND_URL=http://localhost:5173
PORT=3000
```
5. `package.json` のルートに移動（Glitchはルートディレクトリから実行）
6. `server` フォルダの内容をルートにコピーするか、`package.json` を調整

**注意**: Glitchはスリープするため、本番環境には不向きです。

## 1-1. バックエンドのデプロイ（Railway - 有料化の可能性あり）

> **注意**: Railwayは無料プランが制限されており、30日後またはクレジット切れで有料化される可能性があります。完全無料で使う場合は、上記の Render または Fly.io を推奨します。

## 2. フロントエンドのデプロイ（Vercel）

### Vercel CLI を使用する場合

1. Vercel CLI をインストール（未インストールの場合）:
```bash
npm i -g vercel
```

2. フロントエンドディレクトリに移動:
```bash
cd client
```

3. Vercelにログイン:
```bash
vercel login
```

4. デプロイ:
```bash
vercel
```

5. 環境変数を設定:
```bash
vercel env add VITE_API_URL
# バックエンドのURLを入力（例: https://your-app.railway.app）
```

6. 本番環境に再デプロイ:
```bash
vercel --prod
```

### Vercel Web UI を使用する場合

1. [Vercel](https://vercel.com/) にアカウントを作成・ログイン
2. 「Add New Project」をクリック
3. GitHubリポジトリをインポート
4. プロジェクト設定:
   - **Root Directory**: `client` を指定
   - **Framework Preset**: Vite（自動検出される場合があります）
   - **Build Command**: `npm run build`（自動設定される場合があります）
   - **Output Directory**: `dist`（自動設定される場合があります）
5. 環境変数を追加（「Environment Variables」セクション）:
   - **Name**: `VITE_API_URL`
   - **Value**: バックエンドのURL（例: `https://your-app.railway.app`）
   - **Environment**: Production, Preview, Development すべてにチェック
6. 「Deploy」をクリック
7. デプロイ完了後、VercelのURLをメモ（例: `https://your-app.vercel.app`）

## 3. バックエンドの環境変数を更新

フロントエンドのデプロイが完了したら、バックエンドの `FRONTEND_URL` 環境変数を更新します。

**Render**:
1. ダッシュボードの「Environment」セクションを開く
2. `FRONTEND_URL` を Vercel のURLに更新（例: `https://your-app.vercel.app`）
3. 自動的に再デプロイされます

**Fly.io**:
```bash
fly secrets set FRONTEND_URL=https://your-app.vercel.app
```

## 4. 動作確認

1. フロントエンドのURLにアクセス
2. ログインを試す
3. Socket.IO接続が正常に動作することを確認

## トラブルシューティング

### CORS エラーが発生する場合

- バックエンドの `FRONTEND_URL` 環境変数が正しく設定されているか確認
- フロントエンドのURLに末尾のスラッシュがないか確認

### Socket.IO接続が失敗する場合

- バックエンドのURLが正しく設定されているか確認
- バックエンドのログを確認
- ファイアウォールやセキュリティ設定を確認

### 環境変数が反映されない場合

- Vercelの場合、環境変数を追加した後に再デプロイが必要
- 環境変数名が `VITE_` で始まっているか確認（Viteの要件）

## 本番環境での注意事項

- 共通パスワードは本番環境では変更することを推奨
- HTTPSを使用することを推奨
- セキュリティ設定を適切に構成

