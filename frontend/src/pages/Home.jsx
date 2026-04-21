import { useState, useContext } from "react";
import bg from "../../public/katie-smith-uQs1802D0CQ-unsplash.jpg"; // 自分の画像に変更
import { IoIosSearch } from "react-icons/io";
import { BiDish } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api";

export default function Home() {
  const [mode, setMode] = useState("ingredients");
  const [query, setQuery] = useState([]);
  const [utensils, setUtensils] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true); // ← 開始

    try {
      const endpoint =
        mode === "ingredients" ? "/api/recipe" : "/api/recipe/keywords";

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ingredients: typeof query === "string" ? query.split(",") : query,
          utensils: utensils,
        }),
      });

      if (!res.ok) {
        alert(
          "ただいまAIモデルが混み合っており、レシピを生成できませんでした。\n時間をおいて再度お試しください。",
        );
        return;
      }

      const data = await res.json();

      navigate("/recipe", { state: data });
    } catch (err) {
      console.error("エラー:", err);
    } finally {
      setLoading(false); // ← 終了（超重要）
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F4F7F4]">
      {/* Background Image / Overlay - Adjust opacity to let Surface color shine */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          opacity: 0.15,
          mixBlendMode: "multiply",
        }}
      ></div>

      {/* メイン Card Container (M3 Elevated/Surface) */}
      <div className="relative z-10 w-full max-w-2xl bg-[#FDFDFB] p-8 md:p-12 rounded-[2rem] shadow-sm border border-[#E2E8E0] my-8">
        {/* タイトル */}
        <h1 className="text-4xl md:text-5xl font-black text-[#166534] text-center tracking-tight flex justify-center items-center gap-3">
          <span className="text-5xl drop-shadow-sm">
            <BiDish />
          </span>
          レシピの森
        </h1>
        <p className="text-center pt-4 text-[#4A634E] font-medium text-lg">
          AIがあなただけの献立を考えます
        </p>

        {/* モード切替 */}
        <div className="flex justify-center gap-2 my-8">
          <button
            onClick={() => setMode("ingredients")}
            className={`px-6 py-2.5 rounded-full font-bold transition-all ${
              mode === "ingredients"
                ? "bg-[#D1E0CA] text-[#14532D]"
                : "bg-[#F4F7F4] text-[#4A634E] hover:bg-[#E8EDE5]"
            }`}
          >
            材料から探す
          </button>
          <button
            onClick={() => setMode("keywords")}
            className={`px-6 py-2.5 rounded-full font-bold transition-all ${
              mode === "keywords"
                ? "bg-[#D1E0CA] text-[#14532D]"
                : "bg-[#F4F7F4] text-[#4A634E] hover:bg-[#E8EDE5]"
            }`}
          >
            キーワードで探す
          </button>
        </div>

        {/* 検索入力コンテナ */}
        <div className="bg-[#FAFBF9] p-2 rounded-3xl border border-[#E2E8E0] mb-6 focus-within:border-[#166534] focus-within:ring-2 focus-within:ring-[#D1E0CA] transition-all flex items-center shadow-sm">
          <IoIosSearch size={28} className="text-[#4A634E] ml-4 shrink-0" />
          <input
            disabled={loading}
            type="text"
            placeholder={
              mode === "ingredients"
                ? "例：鶏もも肉、白菜、きのこ"
                : "例：10分でできるヘルシーおかず"
            }
            className="w-full p-4 bg-transparent text-[#1F291E] font-medium placeholder-[#7A937E] focus:outline-none text-lg"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* 調理器具の指定 */}
        <div className="mb-8">
          <p className="text-[#4A634E] text-sm font-bold mb-3 pl-2 flex items-center gap-1">
            条件の追加（任意）
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              "フライパンのみ",
              "電子レンジのみ",
              "火を使わない",
              "包丁いらず",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setUtensils(utensils === tag ? "" : tag)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  utensils === tag
                    ? "bg-[#166534] text-white"
                    : "bg-[#F4F7F4] text-[#4A634E] hover:bg-[#E8EDE5]"
                }`}
              >
                {utensils === tag ? "✓ " + tag : tag}
              </button>
            ))}
          </div>
          <input
            disabled={loading}
            type="text"
            value={utensils}
            placeholder="その他の条件（例：炊飯器のみ）"
            className="w-full p-3 pl-4 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9] text-sm text-[#1F291E] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors"
            onChange={(e) => setUtensils(e.target.value)}
          />
        </div>

        {/* 検索ボタン */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="group relative flex items-center justify-center gap-2 w-full md:w-2/3 bg-[#166534] text-white font-bold text-lg py-4 rounded-full hover:bg-[#14532D] hover:shadow-md transition-all disabled:bg-[#A3B8A6] disabled:shadow-none overflow-hidden"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <IoIosSearch size={24} />
                レシピを生成する
              </>
            )}
          </button>
        </div>

        {/* タグ */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {["超簡単", "節約おかず", "ヘルシー", "お弁当"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setMode("keywords");
                setQuery(tag);
              }}
              className="px-4 py-1.5 bg-[#FAFBF9] border border-[#E2E8E0] rounded-lg text-sm text-[#4A634E] font-bold hover:bg-[#E8EDE5] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
