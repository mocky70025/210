import { useState } from "react";
import { API_URL } from "../config";

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

function RegisterScreen({ onRegisterSuccess, onSwitchToLogin }: RegisterScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // バリデーション
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上である必要があります");
      return;
    }

    if (username.length < 3) {
      setError("ユーザー名は3文字以上である必要があります");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (data.success) {
        // 登録成功
        alert("ユーザー登録が完了しました。ログインしてください。");
        onRegisterSuccess();
      } else {
        setError(data.message || "ユーザー登録に失敗しました");
        setLoading(false);
      }
    } catch (err) {
      setError("ユーザー登録に失敗しました。ネットワーク接続を確認してください。");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          ユーザー登録
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="メールアドレスを入力"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ユーザー名（3文字以上）
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ユーザー名を入力"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              パスワード（6文字以上）
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="パスワードを入力"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              パスワード（確認）
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="パスワードを再入力"
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "登録中..." : "登録"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            既にアカウントをお持ちの方はこちら
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;

