import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.username);
        navigate('/');
      } else {
        const errText = await response.text();
        setError(`登録に失敗しました: ${errText}`);
      }
    } catch (err) {
      setError('サーバー通信エラーが発生しました。');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F4F7F4] px-4 py-8">
      <div className="bg-[#FDFDFB] p-8 md:p-10 rounded-[2rem] border border-[#E2E8E0] shadow-sm w-full max-w-md">
        <h2 className="text-3xl font-black text-center text-[#1F291E] mb-8">新規登録</h2>
        
        {error && (
          <div className="bg-[#FCE8E8] text-[#991B1B] p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#4A634E] ml-1 mb-2">ユーザー名</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#FAFBF9] border border-[#E2E8E0] rounded-xl px-4 py-3 text-[#1F291E] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4A634E] ml-1 mb-2">メールアドレス</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAFBF9] border border-[#E2E8E0] rounded-xl px-4 py-3 text-[#1F291E] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4A634E] ml-1 mb-2">パスワード</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAFBF9] border border-[#E2E8E0] rounded-xl px-4 py-3 text-[#1F291E] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#166534] text-white font-bold py-3.5 rounded-full hover:bg-[#14532D] shadow-sm transition-all mt-4"
          >
            登録する
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm font-medium text-[#4A634E]">
          すでにアカウントをお持ちですか？ <Link to="/login" className="text-[#166534] hover:underline">ログイン</Link>
        </div>
      </div>
    </div>
  );
}
