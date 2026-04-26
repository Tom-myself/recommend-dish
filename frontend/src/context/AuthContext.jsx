import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (!storedToken || !storedUsername) {
      // トークンがなければそのままローディング完了
      setLoading(false);
      return;
    }

    // トークンの有効性をバックエンドで検証する
    fetch(`${API_BASE_URL}/api/favorites`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          // セッション切れ → ストレージをクリアしてログアウト状態へ
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          setSessionExpired(true);
        } else {
          // 有効なトークン → ログイン状態を復元
          setToken(storedToken);
          setUser({ username: storedUsername });
        }
      })
      .catch(() => {
        // ネットワークエラーなど → 楽観的に復元（オフライン対応）
        setToken(storedToken);
        setUser({ username: storedUsername });
      })
      .finally(() => {
        setLoading(false);
      });
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
