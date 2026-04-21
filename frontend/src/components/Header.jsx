import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiDish } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-[#FAFBF9] border-b border-[#E2E8E0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-black tracking-tight text-[#166534] flex items-center gap-2"
            >
              <span className="text-3xl">
                <BiDish />
              </span>
              レシピの森
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/favorites"
                  className="text-[#4A634E] font-medium hover:bg-[#E8EDE5] px-4 py-2 rounded-full transition-colors"
                >
                  お気に入り
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-[#CFD8CD]">
                  <span className="text-sm text-[#4A634E]">
                    <span className="font-bold text-[#1F291E]">
                      {user.username}
                    </span>
                    さん
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium bg-[#FCE8E8] text-[#991B1B] hover:bg-[#F8D2D2] px-4 py-2 rounded-full transition-colors"
                  >
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-[#4A634E] font-medium hover:bg-[#E8EDE5] px-5 py-2 rounded-full transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="bg-[#166534] text-white font-medium px-6 py-2 rounded-full hover:bg-[#14532D] shadow-sm transition-colors"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
