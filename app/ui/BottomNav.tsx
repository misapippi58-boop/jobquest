"use client";

import { useEffect, useState } from "react"; // 💡 追加
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { House, Search, BookOpen, Menu, Sparkles } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth"; // 💡 追加
import { auth } from "../src/firebaseConfig"; // 💡 パスはプロジェクトの構成に合わせて調整してください

export default function BottomNav() {
  const pathname = usePathname(); 
  const [user, setUser] = useState<any>(null); // 💡 ログイン状態の管理

  // 💡 ログイン状態を常時監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 💡 未ログイン（ログイン画面）のときは、タブバーを一切描画しない
  if (!user) {
    return null;
  }

  // アイコンの色を判定する関数（ホームは完全一致、他は前方一致にしてサブページでも光るようにしています）
  const getIconColor = (path: string) => {
    const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
    return isActive ? "text-pink-600" : "text-gray-400";
  };

  return (
    <nav className="
      fixed 
      bottom-0 
      left-0 
      right-0 
      bg-white/70
      backdrop-blur-md
      border-t 
      border-pink-100 
      flex 
      h-20
      md:h-16
      z-40"
    >
      {/* この div の中で flex を効かせて均等配置します */}
      <div className="max-w-7xl mx-auto w-full flex justify-evenly items-center px-4">
        <Link href="/analysis" className="flex-1 flex justify-center">
          <Sparkles className={getIconColor("/analysis")} />
        </Link> 

        <Link href="/industry" className="flex-1 flex justify-center">
          <BookOpen className={getIconColor("/industry")} />
        </Link>  
        <Link href="/" className="flex-1 flex justify-center">
          <House className={getIconColor("/")} />
        </Link>
        <Link href="/search" className="flex-1 flex justify-center">
          <Search className={getIconColor("/search")} />
        </Link>
        <Link href="/settings" className="flex-1 flex justify-center">
          <Menu className={getIconColor("/settings")} />
        </Link>
      </div>
    </nav>
  );
}