import React, { createContext, useState, useEffect, useRef } from 'react';

export const AuthContext = createContext();

/** JWTのペイロードをbase64デコードして有効期限を取得 */
function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // ミリ秒に変換
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const expiryTimerRef = useRef(null);

  /** セッション切れ処理（ストレージクリア＋状態リセット） */
  const handleSessionExpired = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
    setSessionExpired(true);
  };

  /** トークンの有効期限に合わせてタイマーを設定 */
  const scheduleExpiryCheck = (currentToken) => {
    // 既存のタイマーをクリア
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
    }

    if (!currentToken) return;

    const expiry = getTokenExpiry(currentToken);
    if (!expiry) return;

    const remaining = expiry - Date.now();
    if (remaining <= 0) {
      // すでに期限切れ
      handleSessionExpired();
      return;
    }

    // 期限ちょうどに発火するタイマーをセット
    expiryTimerRef.current = setTimeout(() => {
      handleSessionExpired();
    }, remaining);
  };

  // 初回マウント時：ストレージからトークンを復元
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (!storedToken || !storedUsername) {
      setLoading(false);
      return;
    }

    // クライアント側でJWTの有効期限を確認（ネットワーク不要）
    const expiry = getTokenExpiry(storedToken);
    if (!expiry || Date.now() >= expiry) {
      // 期限切れ → ストレージをクリアしてセッション切れフラグをセット
      handleSessionExpired();
    } else {
      // 有効なトークン → ログイン状態を復元
      setToken(storedToken);
      setUser({ username: storedUsername });
      scheduleExpiryCheck(storedToken);
    }

    setLoading(false);
  }, []);

  // トークンが変わるたびにタイマーを再設定
  useEffect(() => {
    if (token) {
      scheduleExpiryCheck(token);
    }
    return () => {
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
      }
    };
  }, [token]);

  const login = (newToken, username) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', username);
    setToken(newToken);
    setUser({ username });
    setSessionExpired(false);
  };

  const logout = () => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, sessionExpired, setSessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
};
