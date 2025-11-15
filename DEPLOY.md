# デプロイ手順

このアプリケーションは、フロントエンドとバックエンドを別々のサービスにデプロイします。

## 構成

- **フロントエンド**: Vercel
- **バックエンド**: Railway（または Render、Fly.io など Socket.IO をサポートするサービス）

## 1. バックエンドのデプロイ（Railway推奨）

### Railway でのデプロイ

1. [Railway](https://railway.app/) にアカウントを作成・ログイン
2. 「New Project」→「Deploy from GitHub repo」を選択
3. リポジトリを選択
4. サービス設定で以下を指定：
   - **Root Directory**: `server` を指定
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. 環境変数を設定（「Variables」タブ）：
   - `FRONTEND_URL`: フロントエンドのURL（後で設定するVercelのURL、一時的に `http://localhost:5173` でも可）
   - `PORT`: Railwayが自動設定（通常は環境変数 `PORT` を使用）
6. デプロイが完了したら、RailwayのURLをメモ（例: `https://your-app.railway.app`）

**注意**: Railwayでは、デプロイ後に自動的にURLが生成されます。このURLをフロントエンドの環境変数に設定します。

### その他のサービスでのデプロイ

**Render**:
- Web Service としてデプロイ
- Build Command: `cd server && npm install && npm run build`
- Start Command: `cd server && npm start`

**Fly.io**:
```bash
cd server
fly launch
fly deploy
```

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

**Railway**:
1. プロジェクトの「Variables」タブを開く
2. `FRONTEND_URL` を Vercel のURLに更新（例: `https://your-app.vercel.app`）
3. 再デプロイ

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

