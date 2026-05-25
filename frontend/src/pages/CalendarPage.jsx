import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api";

export default function CalendarPage() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/cooking-logs?year=${year}&month=${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error("取得エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [year, month]);

  // 月を前後に移動する関数
  const changeMonth = (delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setYear(newYear);
    setMonth(newMonth);
  };

  // カレンダーのグリッドを生成する関数
  const generateCalendarDays = () => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay(); // 0=日曜日
    const daysInMonth = lastDay.getDate();

    const days = [];
    // 先頭の空白セル
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    // 日付セル
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  };

  // 特定の日のログを取得する関数
  const getLogsForDay = (day) => {
    if (!summary || !summary.logs) return [];
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return summary.logs.filter((log) => log.cookedDate === dateStr);
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() + 1 &&
      year === today.getFullYear()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F4] p-6 flex justify-center items-center">
        <p className="text-xl text-[#166534] font-bold">読み込み中...</p>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="min-h-screen bg-[#F4F7F4] py-8 px-4 sm:px-6 lg:px-8">
      {/* 戻るボタン */}
      <button
        onClick={() => navigate("/")}
        className="mb-8 flex items-center gap-2 text-[#4A634E] hover:text-[#166534] font-medium transition-colors max-w-6xl mx-auto w-full"
      >
        <span className="text-xl">←</span> ホームへ戻る
      </button>

      {/* タイトル */}
      <h1 className="text-3xl md:text-4xl font-black text-[#1F291E] mb-8 text-center tracking-tight">
        📅 料理カレンダー
      </h1>

      {/* サマリーカード */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#FDFDFB] rounded-2xl border border-[#E2E8E0] p-6 text-center">
          <p className="text-sm font-bold text-[#4A634E] mb-1">今月の合計食費</p>
          <p className="text-3xl font-black text-[#166534]">
            {summary?.totalCostJpy != null
              ? `¥${summary.totalCostJpy.toLocaleString()}`
              : "¥0"}
          </p>
        </div>
        <div className="bg-[#FDFDFB] rounded-2xl border border-[#E2E8E0] p-6 text-center">
          <p className="text-sm font-bold text-[#4A634E] mb-1">作った回数</p>
          <p className="text-3xl font-black text-[#B45309]">
            {summary?.cookCount ?? 0} 回
          </p>
        </div>
        <div className="bg-[#FDFDFB] rounded-2xl border border-[#E2E8E0] p-6 text-center">
          <p className="text-sm font-bold text-[#4A634E] mb-1">1回あたり平均</p>
          <p className="text-3xl font-black text-[#1F291E]">
            {summary?.cookCount > 0 && summary?.totalCostJpy != null
              ? `¥${Math.round(summary.totalCostJpy / summary.cookCount).toLocaleString()}`
              : "—"}
          </p>
        </div>
      </div>

      {/* 月切り替え */}
      <div className="max-w-6xl mx-auto flex justify-center items-center gap-6 mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="text-2xl font-bold text-[#4A634E] hover:text-[#166534] px-4 py-2 rounded-full hover:bg-[#E8EDE5] transition-colors"
        >
          ◀
        </button>
        <h2 className="text-2xl font-black text-[#1F291E] min-w-[160px] text-center">
          {year}年 {month}月
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="text-2xl font-bold text-[#4A634E] hover:text-[#166534] px-4 py-2 rounded-full hover:bg-[#E8EDE5] transition-colors"
        >
          ▶
        </button>
      </div>

      {/* カレンダーグリッド */}
      <div className="max-w-6xl mx-auto bg-[#FDFDFB] rounded-[2rem] border border-[#E2E8E0] p-4 sm:p-6">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day, i) => (
            <div
              key={day}
              className={`text-center text-sm font-bold py-2 ${
                i === 0
                  ? "text-red-400"
                  : i === 6
                    ? "text-blue-400"
                    : "text-[#4A634E]"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 日付セル */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="min-h-[80px]" />;
            }

            const logs = getLogsForDay(day);
            const dayOfWeek = new Date(year, month - 1, day).getDay();

            return (
              <div
                key={day}
                className={`min-h-[80px] sm:min-h-[100px] rounded-xl p-1.5 sm:p-2 border transition-colors ${
                  isToday(day)
                    ? "border-[#166534] bg-[#D1E0CA]/30"
                    : logs.length > 0
                      ? "border-[#E2E8E0] bg-[#FAFBF9]"
                      : "border-transparent"
                }`}
              >
                <span
                  className={`text-xs sm:text-sm font-bold block mb-1 ${
                    dayOfWeek === 0
                      ? "text-red-400"
                      : dayOfWeek === 6
                        ? "text-blue-400"
                        : "text-[#4A634E]"
                  } ${isToday(day) ? "text-[#166534]" : ""}`}
                >
                  {day}
                </span>
                {logs.map((log, j) => (
                  <div
                    key={j}
                    className="text-[10px] sm:text-xs bg-[#166534] text-white rounded-md px-1.5 py-0.5 mb-0.5 truncate font-medium"
                    title={`${log.recipeTitle}${log.estimatedCostJpy ? ` (${log.estimatedCostJpy}円)` : ""}`}
                  >
                    🍳 {log.recipeTitle}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
