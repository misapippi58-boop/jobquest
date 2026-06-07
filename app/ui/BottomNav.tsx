"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { House, Search, BookOpen } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname(); 

  // アイコンの色を判定する関数
  const getIconColor = (path: string) => (pathname === path ? "text-pink-600" : "text-gray-400");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-pink-100 flex justify-around py-3 z-50">
      <Link href="/industry">
        <BookOpen className={getIconColor("/industry")} />
      </Link>  
      <Link href="/">
        <House className={getIconColor("/")} />
      </Link>
      <Link href="/search">
        <Search className={getIconColor("/search")} />
      </Link>
    </nav>
  );
}