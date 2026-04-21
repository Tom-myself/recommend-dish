// Viteの環境変数からAPIベースURLを取得する。
// 設定されていない場合は、ローカル開発環境のデフォルト（http://localhost:8080）を使用する。
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
