// API URLの設定
// 環境変数 VITE_API_URL が設定されている場合はそれを使用
// なければデフォルトの localhost:3000 を使用
// Viteでは、VITE_ で始まる環境変数が自動的に import.meta.env に注入されます
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

