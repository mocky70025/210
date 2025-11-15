# Renderでユーザーを登録する方法

Renderにデプロイした後、データベースは空の状態です。ユーザーを登録する必要があります。

## 方法1: API経由で登録（推奨）

### 1. 管理パスワードを設定

Renderのダッシュボードで：
1. サービスを選択
2. 「Environment」セクションを開く
3. 環境変数を追加：
   - **Key**: `ADMIN_PASSWORD`
   - **Value**: 任意の管理パスワード（例: `admin-secret-2025`）
4. 「Save Changes」をクリック（自動的に再デプロイされます）

### 2. ユーザーを登録

デプロイ完了後、以下のコマンドを実行（またはPostmanなどでAPIを呼び出し）：

```bash
curl -X POST https://two10-u8xp.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tasiro4444@gmail.com",
    "password": "210,42731",
    "username": "tasiro",
    "adminPassword": "admin-secret-2025"
  }'
```

他のユーザーも同様に登録：

```bash
# uchiwa700mocky@gmail.com
curl -X POST https://two10-u8xp.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "uchiwa700mocky@gmail.com",
    "password": "210,42731",
    "username": "mocky",
    "adminPassword": "admin-secret-2025"
  }'

# reizoukunn@gmail.com
curl -X POST https://two10-u8xp.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "reizoukunn@gmail.com",
    "password": "210,42731",
    "username": "れいちゃん",
    "adminPassword": "admin-secret-2025"
  }'
```

## 方法2: Renderのシェルを使用（将来的に実装予定）

現在は、Renderのシェルから直接コマンドを実行する方法はサポートしていません。

## 確認

ユーザーが登録されたか確認するには、ログインを試してください。

## トラブルシューティング

### 「サーバーエラー」が表示される場合

1. Renderのログを確認：
   - ダッシュボードでサービスを選択
   - 「Logs」タブを開く
   - エラーメッセージを確認

2. データベースが初期化されているか確認：
   - ログに「データベースを初期化しました」と表示されているか確認

3. ユーザーが登録されているか確認：
   - ログインを試して、エラーメッセージを確認
   - 「メールアドレスまたはパスワードが正しくありません」と表示されれば、ユーザーが登録されていない可能性があります

