import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ダミーデータ（APIからのデータがない場合やエラー時に、UIの動作を可視化するため）
const dummyFavorites = [];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 絞り込み用のステート
  const [filterIngredient, setFilterIngredient] = useState("");
  const [filterMaxTime, setFilterMaxTime] = useState("");
  const [filterMaxCost, setFilterMaxCost] = useState("");

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // URLパラメータの構築
      const params = new URLSearchParams({ userId: 1 });
      if (filterIngredient) params.append("ingredient", filterIngredient);
      if (filterMaxTime) params.append("maxTime", filterMaxTime);
      if (filterMaxCost) params.append("maxCost", filterMaxCost);

      const url = `http://localhost:8080/api/favorites/search?${params.toString()}`;
      const response = await fetch(url);

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
      <div className="min-h-screen bg-[#f5f1e6] p-6 flex justify-center items-center">
        <p className="text-xl text-green-800 font-bold">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e6] p-6">
      {/* トップへ戻るボタン */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-green-800 hover:underline font-semibold"
      >
        ← ホームへ戻る
      </button>

      <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
        お気に入りレシピ
      </h1>

      {/* 絞り込みフォーム */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">材料で検索</label>
          <input
            type="text"
            value={filterIngredient}
            onChange={(e) => setFilterIngredient(e.target.value)}
            placeholder="例: 鶏肉、玉ねぎ"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">調理時間</label>
          <select
            value={filterMaxTime}
            onChange={(e) => setFilterMaxTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="">指定なし</option>
            <option value="5">5分以下</option>
            <option value="10">10分以下</option>
            <option value="15">15分以下</option>
            <option value="30">30分以下</option>
            <option value="60">60分以下</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">想定材料費</label>
          <select
            value={filterMaxCost}
            onChange={(e) => setFilterMaxCost(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
          className="w-full md:w-auto bg-green-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-800 transition shadow-sm"
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
            // カーソルを合わせた時に少し浮き上がるようなアニメーション(hover:scale)を付与
            className="bg-[#fafaf8] rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-xl font-bold text-green-700 mb-4">
              {recipe.title}
            </h2>

            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                {/* 調理時間 */}
                {recipe.cookingTimeMinutes != null && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-xl">⏱️</span>
                    <span className="font-medium">
                      約 {recipe.cookingTimeMinutes} 分
                    </span>
                  </div>
                )}
                {/* 想定材料費 */}
                {recipe.estimatedCostJpy != null && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-xl">💴</span>
                    <span className="font-medium">
                      約 {recipe.estimatedCostJpy} 円
                    </span>
                  </div>
                )}
              </div>
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
