# adminPassword について

## adminPassword とは？

`adminPassword` は、**運営のみがユーザーを登録できるようにするための管理パスワード**です。

## なぜ必要？

- 一般ユーザーが勝手にアカウントを作成できないようにするため
- 運営が事前に登録したメールアドレスとパスワードを知っている人のみがログインできるようにするため

## デフォルト値

デフォルトでは **`admin-secret-2025`** が設定されています。

## 設定方法

### オプション1: デフォルト値を使用（そのまま使える）

環境変数を設定しなくても、デフォルト値 `admin-secret-2025` が使われます。

### オプション2: Renderで環境変数を設定（推奨）

より安全にするために、独自の管理パスワードを設定できます：

1. Renderのダッシュボードでサービスを選択
2. 「Environment」セクションを開く
3. 環境変数を追加：
   - **Key**: `ADMIN_PASSWORD`
   - **Value**: 任意のパスワード（例: `my-secret-admin-password-2025`）
4. 「Save Changes」をクリック

## 使い方

ユーザーを登録する際に、APIリクエストに `adminPassword` を含めます：

```bash
curl -X POST https://two10-u8xp.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tasiro4444@gmail.com",
    "password": "210,42731",
    "username": "tasiro",
    "adminPassword": "admin-secret-2025"  ← ここに管理パスワードを入力
  }'
```

## 重要

- `adminPassword` が正しくないと、ユーザー登録は拒否されます
- デフォルト値を使う場合は、`admin-secret-2025` をそのまま使用
- 環境変数 `ADMIN_PASSWORD` を設定した場合は、その値を使用

## セキュリティ

- このパスワードは運営のみが知っている必要があります
- 一般ユーザーには公開しないでください
- 本番環境では、デフォルト値ではなく、独自の強力なパスワードを設定することを推奨します

