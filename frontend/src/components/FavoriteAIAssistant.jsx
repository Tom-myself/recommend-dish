import React, { useState, useRef, useEffect, useContext } from "react";
import { TbRobot } from "react-icons/tb";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../api";

const TEMPLATES = [
  {
    icon: "📅",
    label: "1週間の献立",
    question: "お気に入りレシピの中から、バランスの良い1週間分（7日分）の献立を提案してください。",
  },
  {
    icon: "☀️",
    label: "朝食向き",
    question: "お気に入りの中から朝食に向いている料理をいくつか選んで教えてください。",
  },
  {
    icon: "🧹",
    label: "洗い物少なめ",
    question: "お気に入りレシピを、調理器具の使用が少なく洗い物が楽な順に並べて、上位のものを教えてください。",
  },
  {
    icon: "🎲",
    label: "ランダム2品",
    question: "お気に入りの中からランダムで2品選んでください。",
  },
];

export default function FavoriteAIAssistant({ favorites }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "こんにちは！お気に入りレシピについて何でも聞いてください🍳\nテンプレートから選ぶか、自由に質問してみてください。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (open) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async (question) => {
    if (!question.trim() || loading) return;

    const userMsg = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/favorites/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, recipes: favorites }),
      });

      if (res.ok) {
        const text = await res.text();
        setMessages((prev) => [...prev, { role: "assistant", text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "⚠️ エラーが発生しました。もう一度お試しください。",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ サーバーに接続できませんでした。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* トリガーボタン */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="AIアシスタントに質問する"
        className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: open
            ? "linear-gradient(135deg, #14532D, #166534)"
            : "linear-gradient(135deg, #166534, #22c55e22)",
          border: "1.5px solid #CFD8CD",
        }}
      >
        <span className="text-2xl text-white" role="img" aria-label="AI">
          <TbRobot />
        </span>
      </button>

      {/* サイドバーオーバーレイ */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* サイドバー本体 */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col bg-[#FDFDFB] border-l border-[#E2E8E0] shadow-2xl"
        style={{
          width: "min(420px, 100vw)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* ヘッダー */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E8E0] bg-[#FAFBF9]">
          <span className="text-2xl text-[#166534]">
            <TbRobot />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-black text-[#1F291E] text-base leading-tight">
              レシピAIアシスタント
            </p>
            <p className="text-xs text-[#4A634E]">
              お気に入りレシピについて質問できます
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#4A634E] hover:bg-[#E8EDE5] transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* テンプレートボタン */}
        <div className="px-4 pt-4 pb-2 flex flex-col gap-2">
          <p className="text-xs font-bold text-[#7BA882] uppercase tracking-wider mb-1">
            クイック質問
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => sendMessage(t.question)}
                disabled={loading || favorites.length === 0}
                className="flex items-center gap-1.5 bg-[#F4F7F4] hover:bg-[#E8EDE5] text-[#1F291E] text-xs font-semibold px-3 py-2 rounded-full transition-colors border border-[#E2E8E0] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* チャット履歴 */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {favorites.length === 0 && (
            <div className="text-center text-sm text-[#7BA882] bg-[#F4F7F4] rounded-2xl p-4 mt-2">
              お気に入りレシピがまだありません。
              <br />
              レシピをお気に入り登録してから使ってみてください。
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#166534] text-white rounded-br-md"
                    : "bg-[#F4F7F4] text-[#1F291E] rounded-bl-md border border-[#E2E8E0]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#F4F7F4] border border-[#E2E8E0] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                <span className="text-xs text-[#4A634E]">考えています</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="block w-1.5 h-1.5 rounded-full bg-[#4ADE80]"
                      style={{
                        animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 入力フォーム */}
        <form
          onSubmit={handleSubmit}
          className="px-4 py-4 border-t border-[#E2E8E0] bg-[#FAFBF9] flex gap-2 items-end"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="自由に質問してみてください..."
            rows={2}
            disabled={loading || favorites.length === 0}
            className="flex-1 bg-white border border-[#E2E8E0] rounded-xl px-3 py-2.5 text-sm text-[#1F291E] resize-none focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || favorites.length === 0}
            className="w-10 h-10 rounded-xl bg-[#166534] text-white flex items-center justify-center hover:bg-[#14532D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-4px); opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
}
