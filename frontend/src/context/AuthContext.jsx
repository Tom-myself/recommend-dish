import React, { createContext, useState, useEffect } from 'react';

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
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setSessionExpired(true);
    } else {
      // 有効なトークン → ログイン状態を復元
      setToken(storedToken);
      setUser({ username: storedUsername });
    }

    setLoading(false);
  }, []);

  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setToken(token);
    setUser({ username });
  };

  const logout = () => {
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
