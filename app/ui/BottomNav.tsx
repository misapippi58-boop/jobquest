"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { House, Search, BookOpen } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname(); 

  // アイコンの色を判定する関数
  const getIconColor = (path: string) => (pathname === path ? "text-pink-600" : "text-gray-400");

  return (
    <nav className="
    fixed 
    bottom-0 
    left-0 
    right-0 
    bg-white/90 
    backdrop-blur 
    border-t 
    border-pink-100 
    flex 
    h-20
    md:h-16
    z-50"
    >
      {/* この div の中で flex を効かせて均等配置します */}
      <div className="max-w-7xl mx-auto w-full flex justify-evenly items-center px-4">
        <Link href="/industry" className="flex-1 flex justify-center">
          <BookOpen className={getIconColor("/industry")} />
        </Link>  
        <Link href="/" className="flex-1 flex justify-center">
          <House className={getIconColor("/")} />
        </Link>
        <Link href="/search" className="flex-1 flex justify-center">
          <Search className={getIconColor("/search")} />
        </Link>
      </div>
    </nav>
  );
}