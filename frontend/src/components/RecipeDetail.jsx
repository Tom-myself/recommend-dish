import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";

export default function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const recipe = location.state;

  if (!recipe) {
    return <div>データがありません</div>;
  }

  const [liked, setLiked] = useState(false);
  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked); // 先にUI更新（UX良い）

    try {
      await fetch("http://localhost:8080/api/recipe/favorites", {
        method: newLiked ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });
    } catch (err) {
      console.error(err);
      setLiked(!newLiked); // 失敗したら戻す
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e6] p-6">
      {/* 戻る */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-green-800 hover:underline"
      >
        ← 戻る
      </button>

      <div className="max-w-3xl mx-auto bg-[#fafaf8] rounded-3xl shadow-xl p-8">
        <div className="flex justify-end mb-4">
          <button onClick={handleLike} className="text-2xl transition">
            <FaHeart className={liked ? "text-red-500" : "text-gray-300"} />
          </button>
        </div>

        {/* タイトル */}
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          {recipe.title}
        </h1>

        {/* 材料 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-2">材料</h2>
          <ul className="list-disc list-inside space-y-1">
            {recipe.ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 手順 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-2">手順</h2>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        {/* ポイント */}
        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            ポイント
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {recipe.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
