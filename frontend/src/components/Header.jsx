import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-green-700">
              RecipeAI
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/favorites" className="text-gray-600 hover:text-green-600 transition">
                  お気に入り
                </Link>
                <div className="text-sm border-l pl-4 border-gray-300">
                  <span className="text-gray-500 mr-4">ようこそ, <span className="font-semibold text-gray-800">{user.username}</span>さん</span>
                  <button 
                    onClick={handleLogout}
                    className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded transition"
                  >
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-green-600">ログイン</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">新規登録</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
