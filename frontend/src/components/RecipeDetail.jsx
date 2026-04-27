import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { CiCalculator1 } from "react-icons/ci";
import { IoIosTimer } from "react-icons/io";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { RiMoneyCnyCircleLine } from "react-icons/ri";
import { BiDish } from "react-icons/bi";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api";

export default function RecipeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // sessionStorageからレシピを取得（location.stateはフォールバック）
  const storedRecipe = id ? sessionStorage.getItem(`recipe_${id}`) : null;
  const recipe = storedRecipe ? JSON.parse(storedRecipe) : location.state;

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#F4F7F4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-[#4A634E] font-bold mb-4">レシピが見つかりませんでした。</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#166534] text-white font-bold py-3 px-8 rounded-full hover:bg-[#14532D] transition-all"
          >
            ホームへ戻る
          </button>
        </div>
      </div>
    );
  }

  // idが存在する（＝お気に入り一覧から来た、またはDBに保存済みのデータ）場合は初期状態をtrueにする
  const [liked, setLiked] = useState(!!recipe.id);
  const [calories, setCalories] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const handleLike = async () => {
    // 未ログインの場合はログインページへ誘導（現在のURLを保持）
    if (!token) {
      navigate("/login", { state: { from: location.pathname, message: "ハート機能を使うにはログインが必要です" } });
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked); // 先にUI更新（UX良い）

    try {
      await fetch(`${API_BASE_URL}/api/recipe/favorites`, {
        method: newLiked ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipe),
      });
    } catch (err) {
      console.error(err);
      setLiked(!newLiked); // 失敗したら戻す
    }
  };

  const handleCalculateCalories = async () => {
    setIsCalculating(true);
    setCalories(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipe/calories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipe),
      });
      if (response.ok) {
        const data = await response.json();
        setCalories(data.calories);
      } else {
        setCalories("計算エラー");
      }
    } catch (err) {
      console.error(err);
      setCalories("計算エラー");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] py-8 px-4 sm:px-6 lg:px-8">
      {/* 戻る */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-[#4A634E] hover:text-[#166534] font-medium transition-colors max-w-5xl mx-auto w-full"
      >
        <span className="text-xl">←</span> 戻る
      </button>

      <div className="max-w-5xl mx-auto bg-[#FDFDFB] rounded-[2rem] shadow-sm border border-[#E2E8E0] p-8 md:p-12">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLike}
            className={`text-3xl transition-all flex items-center justify-center p-3 rounded-full hover:bg-[#FCE8E8] shrink-0 ${
              liked ? "text-red-500 scale-110" : "text-[#A3B8A6]"
            }`}
          >
            <FaHeart />
          </button>
        </div>

        {/* トップの2カラム（クックパッド風：画像の代わりに情報＋材料表示） */}
        <div className="flex flex-col md:flex-row gap-10 mb-12">
          {/* 左側：タイトルと主要メタデータ */}
          <div className="md:w-7/12 flex flex-col justify-start">
            <h1 className="text-3xl md:text-4xl font-black text-[#1F291E] tracking-tight leading-tight mb-6 border-b border-[#E2E8E0] pb-6">
              {recipe.title}
            </h1>

            {/* サムネイル画像プレースホルダー */}
            <div className="w-full aspect-video bg-[#E8EDE5] rounded-2xl flex items-center justify-center text-6xl text-[#A3B8A6] mb-6 shadow-sm border border-[#CFD8CD]">
              <BiDish />
            </div>

            {/* 節約・時短の指標（アイコン付き） */}
            <div className="flex flex-wrap gap-3">
              {recipe.cookingTimeMinutes != null && (
                <div className="flex items-center gap-2 bg-[#E8EDE5] text-[#2B3229] px-4 py-2 rounded-lg font-bold text-sm">
                  <span className="text-xl">
                    <IoIosTimer />
                  </span>
                  <span>{recipe.cookingTimeMinutes} 分</span>
                </div>
              )}
              {recipe.estimatedCostJpy != null && (
                <div className="flex items-center gap-2 bg-[#E8EDE5] text-[#2B3229] px-4 py-2 rounded-lg font-bold text-sm">
                  <span className="text-xl">
                    <RiMoneyCnyCircleLine />
                  </span>
                  <span>{recipe.estimatedCostJpy} 円</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-[#E8EDE5] text-[#2B3229] px-4 py-2 rounded-lg font-bold text-sm">
                <span className="text-xl text-[#B45309]">
                  <CiCalculator1 />
                </span>
                {calories ? (
                  <span>約 {calories}</span>
                ) : (
                  <button
                    onClick={handleCalculateCalories}
                    disabled={isCalculating}
                    className="text-[#B45309] hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    {isCalculating ? "計算中..." : "AIカロリー計算"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 右側：材料リスト */}
          <div className="md:w-5/12">
            <section className="bg-[#FAFBF9] border border-[#E2E8E0] p-6 rounded-2xl h-full">
              <h2 className="text-2xl font-bold text-[#1F291E] mb-6 pb-2 border-b-2 border-[#166534] inline-block">
                材料
              </h2>
              <ul className="space-y-4">
                {recipe.ingredients.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-end border-b border-dotted border-[#CFD8CD] pb-2"
                  >
                    <span className="text-[#2B3229] font-medium leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* 手順 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F291E] mb-6 pb-2 border-b-2 border-[#166534] inline-block">
            作り方
          </h2>
          <ol className="space-y-6">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#166534] text-white rounded-full flex items-center justify-center font-bold text-sm mt-1">
                  {i + 1}
                </div>
                <p className="text-[#2B3229] leading-relaxed pt-1 flex-1 border-b border-[#E2E8E0] pb-6">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ポイント */}
        <section className="bg-[#E8EDE5] p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-[#166534] mb-3 flex items-center gap-2">
            <span className="text-xl">
              <MdOutlineTipsAndUpdates />
            </span>
            コツ・ポイント
          </h2>
          <ul className="list-disc list-inside space-y-2">
            {recipe.points.map((point, i) => (
              <li
                key={i}
                className="text-[#2B3229] font-medium leading-relaxed"
              >
                {point}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
