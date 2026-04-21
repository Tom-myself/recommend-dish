import React, { useState, useEffect, useContext } from "react";
import { IoIosTimer } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api";

// ダミーデータ（APIからのデータがない場合やエラー時に、UIの動作を可視化するため）
const dummyFavorites = [];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // 絞り込み用のステート
  const [filterIngredient, setFilterIngredient] = useState("");
  const [filterMaxTime, setFilterMaxTime] = useState("");
  const [filterMaxCost, setFilterMaxCost] = useState("");

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // URLパラメータの構築
      const params = new URLSearchParams();
      if (filterIngredient) params.append("ingredient", filterIngredient);
      if (filterMaxTime) params.append("maxTime", filterMaxTime);
      if (filterMaxCost) params.append("maxCost", filterMaxCost);

      const url = `${API_BASE_URL}/api/favorites/search?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // バックエンドからのデータが存在する場合はそれを使用
        if (data && data.length > 0) {
          const safeData = data.map((item) => ({
            ...item,
            ingredients: item.ingredients || [
              "材料データがありません（未取得）",
            ],
            steps: item.steps || ["手順データがありません"],
            points: item.points || ["ポイントデータがありません"],
          }));
          setFavorites(safeData);
        } else {
          // 検索結果が0件の場合
          setFavorites([]);
        }
      } else {
        console.log("APIエラーが返されました。ダミーデータを表示します。");
        setFavorites(dummyFavorites);
      }
    } catch (error) {
      console.error("通信エラー:", error);
      setFavorites(dummyFavorites);
    } finally {
      // 読み込み完了状態にする
      setLoading(false);
    }
  };

  useEffect(() => {
    // コンポーネントマウント時（画面読み込み時）にAPIからお気に入りリストを取得する
    fetchFavorites();
  }, []);

  // カードがクリックされたとき、詳細画面 (RecipeDetail) へ遷移する関数
  const handleCardClick = (recipe) => {
    // stateにrecipeオブジェクトを丸ごと渡すことで、RecipeDetail側でその内容を受信・表示できる
    navigate("/recipe", { state: recipe });
  };

  if (loading) {
    // 画面ロード中の表示
    return (
      <div className="min-h-screen bg-[#F4F7F4] p-6 flex justify-center items-center">
        <p className="text-xl text-[#166534] font-bold">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F4] py-8 px-4 sm:px-6 lg:px-8">
      {/* トップへ戻るボタン */}
      <button
        onClick={() => navigate("/")}
        className="mb-8 flex items-center gap-2 text-[#4A634E] hover:text-[#166534] font-medium transition-colors max-w-6xl mx-auto w-full"
      >
        <span className="text-xl">←</span> ホームへ戻る
      </button>

      <h1 className="text-3xl md:text-4xl font-black text-[#1F291E] mb-8 text-center tracking-tight">
        お気に入りレシピ
      </h1>

      {/* 絞り込みフォーム */}
      <div className="max-w-4xl mx-auto bg-[#FDFDFB] p-8 rounded-[2rem] border border-[#E2E8E0] mb-12 flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="block text-sm font-bold text-[#4A634E] ml-1">
            材料で検索
          </label>
          <input
            type="text"
            value={filterIngredient}
            onChange={(e) => setFilterIngredient(e.target.value)}
            placeholder="例: 鶏肉、玉ねぎ"
            className="w-full bg-[#FAFBF9] border border-[#E2E8E0] rounded-xl px-4 py-3 text-[#1F291E] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors"
          />
        </div>
        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="block text-sm font-bold text-[#4A634E] ml-1">
            調理時間
          </label>
          <select
            value={filterMaxTime}
            onChange={(e) => setFilterMaxTime(e.target.value)}
            className="w-full bg-[#FAFBF9] border border-[#E2E8E0] rounded-xl px-4 py-3 text-[#1F291E] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors"
          >
            <option value="">指定なし</option>
            <option value="5">5分以下</option>
            <option value="10">10分以下</option>
            <option value="15">15分以下</option>
            <option value="30">30分以下</option>
            <option value="60">60分以下</option>
          </select>
        </div>
        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="block text-sm font-bold text-[#4A634E] ml-1">
            想定材料費
          </label>
          <select
            value={filterMaxCost}
            onChange={(e) => setFilterMaxCost(e.target.value)}
            className="w-full bg-[#FAFBF9] border border-[#E2E8E0] rounded-xl px-4 py-3 text-[#1F291E] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors"
          >
            <option value="">指定なし</option>
            <option value="300">300円以下</option>
            <option value="500">500円以下</option>
            <option value="800">800円以下</option>
            <option value="1000">1000円以下</option>
          </select>
        </div>
        <button
          onClick={fetchFavorites}
          className="w-full md:w-auto bg-[#166534] text-white font-bold py-3 px-8 rounded-full hover:bg-[#14532D] shadow-sm transition-all"
        >
          絞り込む
        </button>
      </div>

      {/* レシピをグリッド形式（カード一覧）で並べるコンテナ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {favorites.map((recipe) => (
          <div
            key={recipe.id || recipe.title}
            onClick={() => handleCardClick(recipe)}
            // M3 Outlined Card properties
            className="bg-[#FDFDFB] rounded-[2rem] border border-[#E2E8E0] p-6 sm:p-8 cursor-pointer hover:bg-[#E8EDE5]/30 hover:border-[#CFD8CD] transition-colors focus:ring-2 focus:ring-[#166534] focus:outline-none flex flex-col h-full group"
            tabIndex={0}
          >
            <h2 className="text-xl font-bold text-[#1F291E] leading-tight mb-6 line-clamp-2 break-normal group-hover:text-[#166534] transition-colors">
              {recipe.title}
            </h2>

            <div className="flex flex-wrap gap-2 mt-auto">
              {/* 調理時間 */}
              {recipe.cookingTimeMinutes != null && (
                <div className="flex items-center gap-1.5 bg-[#F4F7F4] text-[#4A634E] px-3 py-1.5 rounded-lg text-sm font-bold">
                  <span>
                    <IoIosTimer />
                  </span>
                  <span>{recipe.cookingTimeMinutes} 分</span>
                </div>
              )}
              {/* 想定材料費 */}
              {recipe.estimatedCostJpy != null && (
                <div className="flex items-center gap-1.5 bg-[#F4F7F4] text-[#4A634E] px-3 py-1.5 rounded-lg text-sm font-bold">
                  <span></span>
                  <span>{recipe.estimatedCostJpy} 円</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 万が一データ表示が0件になった場合のフォールバック */}
      {favorites.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          お気に入り登録されたレシピがありません。
        </p>
      )}
    </div>
  );
}
