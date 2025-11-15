import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { User, Room } from "../types";

interface LobbyScreenProps {
  currentUser: User;
  onLogout: () => void;
  getSocket: () => Socket | null;
  onRoomCreated: (room: Room) => void;
  onRoomJoined: (room: Room) => void;
}

function LobbyScreen({
  currentUser,
  onLogout,
  getSocket,
  onRoomCreated,
  onRoomJoined,
}: LobbyScreenProps) {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [transferTarget, setTransferTarget] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // 初期データを設定（ログイン成功時にサーバーから受け取ったデータ）
    const initialData = (socket as any).initialData;
    if (initialData) {
      setOnlineUsers(initialData.onlineUsers || []);
      setAvailableRooms(initialData.availableRooms || []);
      delete (socket as any).initialData; // 使用後は削除
    }

    // オンラインユーザー一覧の更新
    socket.on("online_users_updated", (data: { onlineUsers: User[] }) => {
      setOnlineUsers(data.onlineUsers);
    });

    // ルームリストの更新
    socket.on("room_list_updated", (data: { availableRooms: Room[] }) => {
      setAvailableRooms(data.availableRooms);
    });

    // ルーム作成成功
    socket.on("room_created", (data: { room: Room }) => {
      onRoomCreated(data.room);
    });

    // ルーム参加成功
    socket.on("room_joined", (data: { room: Room }) => {
      onRoomJoined(data.room);
    });

    // ポイント譲渡成功
    socket.on("transfer_success", (data: { updatedUser: User; message: string }) => {
      alert(data.message);
      // 現在のユーザー情報を更新
      if (data.updatedUser.id === currentUser.id) {
        // 状態を更新する必要がある場合はここで処理
      }
    });

    // ポイント受取通知
    socket.on("points_received", (data: { updatedUser: User; message: string }) => {
      alert(data.message);
    });

    // エラー処理
    socket.on("error", (data: { message: string }) => {
      alert(`エラー: ${data.message}`);
    });

    return () => {
      socket.off("online_users_updated");
      socket.off("room_list_updated");
      socket.off("room_created");
      socket.off("room_joined");
      socket.off("transfer_success");
      socket.off("points_received");
      socket.off("error");
    };
  }, [getSocket, onRoomCreated, onRoomJoined, currentUser]);

  const handleCreateRoom = () => {
    const socket = getSocket();
    if (!socket) return;

    // じゃんけんルームを作成
    socket.emit("create_room", { gameType: "rps" });
  };

  const handleJoinRoom = (roomId: string) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("join_room", { roomId });
  };

  const handleTransferPoints = (e: React.FormEvent) => {
    e.preventDefault();
    const socket = getSocket();
    if (!socket) return;

    const amount = parseInt(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("有効な金額を入力してください");
      return;
    }

    socket.emit("transfer_points", {
      targetUsername: transferTarget,
      amount,
    });

    setTransferTarget("");
    setTransferAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                ロビー
              </h1>
              <p className="text-gray-600 mt-1">
                ようこそ、{currentUser.username} さん
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {currentUser.points}pt
              </div>
              <button
                onClick={onLogout}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム：オンラインユーザー & ポイント譲渡 */}
          <div className="space-y-6">
            {/* オンラインユーザー一覧 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                オンラインユーザー ({onlineUsers.length}人)
              </h2>
              <div className="space-y-2">
                {onlineUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded ${
                      user.id === currentUser.id
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{user.username}</span>
                      <span className="text-sm text-gray-600">
                        {user.points}pt
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ポイント譲渡 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                ポイント譲渡
              </h2>
              <form onSubmit={handleTransferPoints} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    対象ユーザー
                  </label>
                  <input
                    type="text"
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ユーザー名を入力"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    譲渡額
                  </label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ポイント数"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition"
                >
                  譲渡
                </button>
              </form>
            </div>
          </div>

          {/* 右カラム：ルーム一覧 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  ゲームルーム
                </h2>
                <button
                  onClick={handleCreateRoom}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition"
                >
                  ルーム作成
                </button>
              </div>

              {availableRooms.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  参加可能なルームがありません
                </p>
              ) : (
                <div className="space-y-3">
                  {availableRooms.map((room) => (
                    <div
                      key={room.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-800">
                            {room.gameType === "rps" ? "じゃんけん" : room.gameType}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            ベット額: {room.betAmount}pt | 参加者: {room.players.length}/2
                          </div>
                        </div>
                        <button
                          onClick={() => handleJoinRoom(room.id)}
                          disabled={room.players.length >= 2}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {room.players.length >= 2 ? "満員" : "参加"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LobbyScreen;

