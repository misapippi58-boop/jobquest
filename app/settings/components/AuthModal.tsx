"use client";

import { ShieldCheck, X, Mail, Lock, UserPlus, LogIn } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authMode: "login" | "signup";
  setAuthMode: (mode: "login" | "signup") => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  errorMessage: string;
  setErrorMessage: (val: string) => void;
  handleEmailAuth: (e: React.FormEvent) => void;
  handleGoogleAuth: () => void;
}

export default function AuthModal({
  isOpen, onClose, authMode, setAuthMode,
  email, setEmail, password, setPassword,
  errorMessage, setErrorMessage, handleEmailAuth, handleGoogleAuth
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-pink-600" /> 
            {authMode === "signup" ? "アカウントを作成" : "ログイン"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex bg-pink-50 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setAuthMode("signup"); setErrorMessage(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === "signup" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500"}`}
          >
            新規登録
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("login"); setErrorMessage(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === "login" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500"}`}
          >
            ログイン
          </button>
        </div>

        {errorMessage && (
          <p className="text-[11px] text-red-500 bg-red-50 p-2.5 rounded-xl font-bold text-center">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 pl-1">メールアドレス</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 pl-1">パスワード (6文字以上)</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-pink-200 flex items-center justify-center gap-2 mt-2"
          >
            {authMode === "signup" ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {authMode === "signup" ? "アカウントを作成" : "ログインする"}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-400 uppercase">または</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-3 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {authMode === "signup" ? "Googleで登録" : "Googleでログイン"}
        </button>
      </div>
    </div>
  );
}