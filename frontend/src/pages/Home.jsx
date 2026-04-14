import { useState } from "react";
import bg from "../../public/katie-smith-uQs1802D0CQ-unsplash.jpg"; // 自分の画像に変更
import { IoIosSearch } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const [mode, setMode] = useState("ingredients");
  const [query, setQuery] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true); // ← 開始

    try {
      const res = await fetch("http://localhost:8080/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: query.split(","),
        }),
      });

      const data = await res.json();

      navigate("/recipe", { state: data });
    } catch (err) {
      console.error("エラー:", err);
    } finally {
      setLoading(false); // ← 終了（超重要）
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      {/* 明るいオーバーレイ */}
      <div className="absolute inset-0 bg-white/60"></div>

      {/* メイン */}
      <div className="relative z-10 w-full max-w-xl bg-[#fafaf8] p-8 rounded-3xl shadow-xl">
        {/* タイトル */}
        <h1 className="text-4xl font-bold text-green-800 text-center">
          レシピの森
        </h1>
        <p className="text-center pt-6">
          キーワードで、あなたにぴったりのレシピを検索
        </p>

        {/* モード切替 */}
        <div className="flex justify-center gap-4 my-6">
          <button
            onClick={() => setMode("ingredients")}
            className={`px-4 py-2 rounded-full ${
              mode === "ingredients"
                ? "bg-green-700 text-white"
                : "bg-[#f5f1e6]"
            }`}
          >
            材料
          </button>
          <button
            onClick={() => setMode("keywords")}
            className={`px-4 py-2 rounded-full ${
              mode === "keywords" ? "bg-green-700 text-white" : "bg-[#f5f1e6]"
            }`}
          >
            キーワード
          </button>
        </div>

        {/* 入力 */}
        <input
          disabled={loading}
          type="text"
          placeholder={
            mode === "ingredients" ? "例：鶏肉、玉ねぎ" : "例：簡単、ヘルシー"
          }
          className="w-full p-4 rounded-full border border-[#e5dcc8] bg-[#f5f1e6] mb-4 focus:outline-none focus:ring-2 focus:ring-green-700"
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* 検索ボタン */}

        <div className="flex justify-center mt-4">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-30 bg-green-700 text-white py-3 rounded-full hover:bg-green-800 transition disabled:bg-gray-400"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <IoIosSearch size={20} />
                検索
              </>
            )}
            {/* {loading && (
              <div className="flex flex-col items-center mt-6 gap-2">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-green-800 text-sm">レシピを考え中...</p>
              </div>
            )} */}
          </button>
        </div>

        {/* タグ */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {["簡単", "時短", "ヘルシー"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setMode("keywords");
                setQuery(tag);
              }}
              className="px-3 py-1 bg-[#f5f1e6] rounded-full text-sm text-green-800 hover:bg-green-100"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
