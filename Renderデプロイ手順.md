# Render デプロイ手順（完全無料・最も簡単）

RenderはWeb UIから簡単にデプロイできます。CLIのインストールは不要です！

## Renderの無料プラン

- ✅ **完全無料**
- ✅ **WebSocket対応**（Socket.IO動作可能）
- ✅ **GitHub連携**（自動デプロイ）
- ⚠️ **15分間アクセスがないとスリープ**（次回アクセス時に自動復帰、30秒程度かかる）

## デプロイ手順

### 1. Renderにアカウント作成

1. [Render](https://render.com/) にアクセス
2. 「Get Started for Free」をクリック
3. GitHubアカウントでログイン（推奨）

### 2. 新しいWeb Serviceを作成

1. ダッシュボードで「New +」をクリック
2. 「Web Service」を選択

### 3. GitHubリポジトリを接続

1. 「Connect account」または「Connect repository」をクリック
2. GitHubアカウントを認証
3. リポジトリ `reizoukunn-debug/210` を選択
4. 「Connect」をクリック

### 4. サービス設定

以下の設定を入力：

- **Name**: `minigame-backend`（任意の名前）
- **Region**: `Singapore` または `Oregon`（アジアに近いリージョン）
- **Branch**: `main`
- **Root Directory**: `server` ⚠️ **重要：ここに `server` と入力**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 5. 環境変数を設定

「Environment」セクションで以下を追加：

1. **Key**: `FRONTEND_URL`
   **Value**: `http://localhost:5173`（一時的、後でVercelのURLに更新）

2. **Key**: `PORT`
   **Value**: `10000`（Renderのデフォルトポート）

### 6. プラン選択

- **Free** プランを選択（デフォルト）

### 7. デプロイ開始

1. 「Create Web Service」をクリック
2. デプロイが自動的に開始されます
3. 数分待つとデプロイが完了します

### 8. デプロイ完了

デプロイが完了すると、以下のようなURLが表示されます：
```
https://minigame-backend.onrender.com
```

このURLをメモしてください（後でVercelの環境変数に設定します）。

## デプロイ後の確認

### ログを確認

1. ダッシュボードでサービスを選択
2. 「Logs」タブをクリック
3. エラーがないか確認

### 動作確認

ブラウザで以下のURLにアクセス：
```
https://your-app-name.onrender.com
```

「Cannot GET /」と表示されれば正常です（APIエンドポイントがないため）。

## フロントエンド（Vercel）デプロイ後

Vercelのデプロイが完了したら、Renderの環境変数を更新：

1. Renderダッシュボードでサービスを選択
2. 「Environment」セクションを開く
3. `FRONTEND_URL` を編集
4. VercelのURLに変更（例: `https://your-app.vercel.app`）
5. 「Save Changes」をクリック
6. 自動的に再デプロイされます

## よくある問題

### デプロイが失敗する場合

1. **ログを確認**:
   - ダッシュボードの「Logs」タブでエラーを確認

2. **Root Directoryが正しいか確認**:
   - `server` になっているか確認

3. **Build Commandが正しいか確認**:
   - `npm install && npm run build` になっているか

4. **Start Commandが正しいか確認**:
   - `npm start` になっているか

### アプリがスリープしている場合

- 15分間アクセスがないとスリープします
- 次回アクセス時に自動的に復帰します（30秒程度かかります）
- スリープを防ぎたい場合は、定期的にアクセスするか、Uptime Robotなどの無料サービスでpingを送る

### 環境変数が反映されない場合

- 環境変数を変更したら、自動的に再デプロイされます
- 再デプロイが完了するまで数分かかります

## 次のステップ

1. ✅ Renderのデプロイが完了したら、URLをメモ
2. Vercelでフロントエンドをデプロイ
3. VercelのURLを取得したら、Renderの `FRONTEND_URL` を更新

## 無料プランの制限

- 15分間アクセスがないとスリープ
- 初回復帰に30秒程度かかる
- 通常の使用では問題ありません

