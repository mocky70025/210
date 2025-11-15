import { RPSChoice, GameResult } from "../types";

/**
 * じゃんけんの勝敗判定
 * @param choice1 プレイヤー1の手
 * @param choice2 プレイヤー2の手
 * @returns 1: プレイヤー1の勝ち, 2: プレイヤー2の勝ち, 0: 引き分け
 */
export function judgeRPS(choice1: RPSChoice, choice2: RPSChoice): 0 | 1 | 2 {
  if (choice1 === choice2) {
    return 0; // 引き分け
  }

  // 勝敗判定ロジック
  if (
    (choice1 === "rock" && choice2 === "scissors") ||
    (choice1 === "paper" && choice2 === "rock") ||
    (choice1 === "scissors" && choice2 === "paper")
  ) {
    return 1; // プレイヤー1の勝ち
  }

  return 2; // プレイヤー2の勝ち
}

/**
 * じゃんけんゲームの結果を計算
 * @param player1Id プレイヤー1のID
 * @param player1Choice プレイヤー1の手
 * @param player2Id プレイヤー2のID
 * @param player2Choice プレイヤー2の手
 * @param betAmount ベット額
 * @returns ゲーム結果
 */
export function calculateRPSResult(
  player1Id: string,
  player1Choice: RPSChoice,
  player2Id: string,
  player2Choice: RPSChoice,
  betAmount: number
): GameResult {
  const result = judgeRPS(player1Choice, player2Choice);

  if (result === 0) {
    // 引き分け：ポイント変動なし
    return {
      isDraw: true,
      loserIds: [],
      pointsChange: {
        [player1Id]: 0,
        [player2Id]: 0,
      },
    };
  }

  // 勝敗が決まった場合
  const winnerId = result === 1 ? player1Id : player2Id;
  const loserId = result === 1 ? player2Id : player1Id;

  return {
    winnerId,
    loserIds: [loserId],
    isDraw: false,
    pointsChange: {
      [winnerId]: betAmount, // 勝者はベット額分獲得（敗者から減った分）
      [loserId]: -betAmount, // 敗者はベット額分減少
    },
  };
}

