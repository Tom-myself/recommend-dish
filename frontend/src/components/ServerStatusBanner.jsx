import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../api';

const MESSAGES = [
  { icon: '🥕', text: '材料を仕入れています...' },
  { icon: '🔪', text: '下準備をしています...' },
  { icon: '🍳', text: '厨房を温めています...' },
  { icon: '🧂', text: 'スパイスを準備しています...' },
  { icon: '🫕', text: 'レシピを確認しています...' },
  { icon: '👨‍🍳', text: 'シェフが準備をしています...' },
];

export default function ServerStatusBanner() {
  // null = まだ確認中, true = サーバー起動済み, false = 未起動
  const [serverReady, setServerReady] = useState(null);
  const [fading, setFading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const checkIntervalRef = useRef(null);
  const msgIntervalRef = useRef(null);
  const isCheckingRef = useRef(false);

  const markReady = () => {
    clearInterval(checkIntervalRef.current);
    clearInterval(msgIntervalRef.current);
    setFading(true);
    setTimeout(() => setServerReady(true), 700);
  };

  const checkServer = async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(60000), 
      });
      markReady();
    } catch (err) {
      setServerReady(false);
    } finally {
      isCheckingRef.current = false;
    }
  };

  useEffect(() => {
    checkServer();
    checkIntervalRef.current = setInterval(checkServer, 5000);
    msgIntervalRef.current = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2500);

    return () => {
      clearInterval(checkIntervalRef.current);
      clearInterval(msgIntervalRef.current);
    };
  }, []);

  // サーバー起動済み or まだ確認中（初回チェック前）は表示しない
  if (serverReady === true || serverReady === null) return null;

  const { icon, text } = MESSAGES[msgIndex];

  return (
    <div
      style={{
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        opacity: fading ? 0 : 1,
        transform: fading ? 'translateY(20px)' : 'translateY(0)',
      }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-[#1F291E] text-[#E8EDE5] px-6 py-4 rounded-2xl shadow-2xl border border-[#3A5240] max-w-sm w-[calc(100%-2rem)]"
    >
      {/* スピナー */}
      <div className="flex-shrink-0 w-5 h-5 border-2 border-[#4ADE80] border-t-transparent rounded-full animate-spin" />

      {/* メッセージ */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-[#7BA882] font-medium mb-0.5">サーバー起動中</span>
        <span className="text-sm font-semibold flex items-center gap-1.5">
          <span>{icon}</span>
          <span className="truncate">{text}</span>
        </span>
      </div>

      {/* パルスドット */}
      <div className="flex-shrink-0 ml-auto flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-[#4ADE80]"
            style={{
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
