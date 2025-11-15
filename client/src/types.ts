// ユーザー情報
export interface User {
  id: number;
  email: string;
  username: string;
  points: number;
}

// ゲームタイプ
export type GameType = "rps";

// じゃんけんの手
export type RPSChoice = "rock" | "paper" | "scissors";

// ルーム情報
export interface Room {
  id: string;
  gameType: GameType;
  hostId: string;
  players: string[];
  status: "waiting" | "playing" | "finished";
  betAmount: number;
  gameData?: any;
}

// ゲーム結果
export interface GameResult {
  winnerId?: string;
  loserIds: string[];
  isDraw: boolean;
  pointsChange: Record<string, number>;
}

