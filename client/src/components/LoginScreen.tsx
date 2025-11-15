import { useState } from "react";
import { io, Socket } from "socket.io-client";
import { User } from "../types";
import { API_URL } from "../config";

interface LoginScreenProps {
  onLoginSuccess: (user: User, socket: Socket) => void;
}

function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Socket.IO 接続を確立
    const socket = io(API_URL);

    // ログインイベントを送信
    socket.emit("login", { username, password });

    // ログイン成功
    socket.once("login_success", (data: { 
      user: User;
      onlineUsers: User[];
      availableRooms: any[];
    }) => {
      setLoading(false);
      // 初期データを socket に保存（LobbyScreen で使用）
      (socket as any).initialData = {
        onlineUsers: data.onlineUsers,
        availableRooms: data.availableRooms,
      };
      onLoginSuccess(data.user, socket);
    });

    // ログインエラー
    socket.once("login_error", (data: { message: string }) => {
      setError(data.message);
      setLoading(false);
      socket.disconnect();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          ポイント制ミニゲーム
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ユーザー名を入力"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="共通パスワードを入力"
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;

