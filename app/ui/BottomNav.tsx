"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { House, Search, BookOpen, Menu, Sparkles } from "lucide-react"; // 💡 Sparkles を追加

export default function BottomNav() {
  const pathname = usePathname(); 

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
        {/* 👇 一番左に追加：自己分析タブ */}
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