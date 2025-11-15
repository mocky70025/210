# Fly.io デプロイ手順（完全無料）

## 1. Fly.io CLI のインストール

### macOS (Homebrew推奨)
```bash
brew install flyctl
```

### macOS (直接インストール)
```bash
curl -L https://fly.io/install.sh | sh
```

### インストール確認
```bash
flyctl version
```

## 2. Fly.io にログイン

```bash
flyctl auth login
```

ブラウザが開くので、GitHubアカウントでログインします。

## 3. サーバーディレクトリに移動

```bash
cd server
```

## 4. Fly.io アプリを初期化

```bash
flyctl launch
```

以下の質問に答えます：

1. **App name**: アプリ名を入力（例: `minigame-backend-210`）
   - 既存のアプリ名と重複しないように注意
   - 小文字、数字、ハイフンのみ使用可能

2. **Region**: リージョンを選択
   - `nrt` (東京) を推奨
   - または `hnd` (羽田) も選択可能

3. **PostgreSQL**: `n` (不要)
   - データベースは使用していないため

4. **Redis**: `n` (不要)

5. **Deploy now?**: `y` (今すぐデプロイ)

## 5. 環境変数の設定

### 一時的な設定（後で更新）
```bash
flyctl secrets set FRONTEND_URL=http://localhost:5173
```

### ポート設定（fly.tomlに既に記載済み）
```bash
flyctl secrets set PORT=8080
```

## 6. デプロイ

```bash
flyctl deploy
```

初回デプロイには数分かかります。

## 7. デプロイ確認

デプロイが完了すると、以下のようなURLが表示されます：
```
https://your-app-name.fly.dev
```

このURLをメモしてください。

## 8. 動作確認

```bash
# アプリの状態を確認
flyctl status

# ログを確認
flyctl logs

# アプリを開く
flyctl open
```

## 9. フロントエンド（Vercel）デプロイ後

Vercelのデプロイが完了したら、`FRONTEND_URL` を更新：

```bash
flyctl secrets set FRONTEND_URL=https://your-vercel-app.vercel.app
```

アプリは自動的に再起動されます。

## よくある問題と解決方法

### デプロイが失敗する場合

1. **ビルドエラー**:
   ```bash
   flyctl logs
   ```
   ログを確認してエラーを特定

2. **ポートエラー**:
   - `fly.toml` の `internal_port` が `8080` になっているか確認
   - サーバーの `PORT` 環境変数が `8080` になっているか確認

3. **メモリ不足**:
   ```bash
   flyctl scale memory 256
   ```

### アプリが起動しない場合

```bash
# アプリを再起動
flyctl apps restart your-app-name

# ログを確認
flyctl logs
```

### 環境変数を確認

```bash
flyctl secrets list
```

### アプリを削除する場合

```bash
flyctl apps destroy your-app-name
```

## 無料プランの制限

- **CPU**: 3つの共有CPU
- **メモリ**: 256MB RAM
- **CPU時間**: 月間160時間
- **ネットワーク**: 160GB/月の転送

通常の使用では十分です。

## 次のステップ

1. Fly.ioのデプロイが完了したら、URLをメモ
2. Vercelでフロントエンドをデプロイ
3. VercelのURLを取得したら、Fly.ioの `FRONTEND_URL` を更新

