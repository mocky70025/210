// ユーザー情報
export interface User {
  id: string; // Socket.IO の socket.id
  username: string;
  points: number;
}

// ゲームタイプ
export type GameType = "rps"; // 将来的に拡張可能

// じゃんけんの手
export type RPSChoice = "rock" | "paper" | "scissors";

// ルーム情報
export interface Room {
  id: string;
  gameType: GameType;
  hostId: string; // ホストの socket.id
  players: string[]; // socket.id の配列
  status: "waiting" | "playing" | "finished";
  betAmount: number; // このゲームのベット額
  gameData?: any; // ゲーム固有のデータ
}

// ゲーム結果
export interface GameResult {
  winnerId?: string; // 勝者の socket.id（引き分けの場合は undefined）
  loserIds: string[]; // 敗者の socket.id の配列
  isDraw: boolean; // 引き分けかどうか
  pointsChange: Record<string, number>; // 各プレイヤーのポイント変動
}

