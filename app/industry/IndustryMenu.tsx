"use client";

import { useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

type Props = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean | ((v: boolean) => boolean)) => void;
  sortType: string;
  setSortType: (type: "manual" | "salary" | "created") => void;
  deleteMode: boolean;
  setDeleteMode: (mode: boolean | ((v: boolean) => boolean)) => void;
  setSelectedDelete: (ids: string[]) => void;
};

export default function IndustryMenu({ 
  menuOpen, 
  setMenuOpen, 
  sortType, 
  setSortType, 
  deleteMode, 
  setDeleteMode,
  setSelectedDelete 
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  // メニューの外側をクリックしたときに閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="p-2 rounded-full hover:bg-pink-100 transition-colors"
      >
        <MoreVertical size={22} className="text-gray-600" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-12 w-48 rounded-2xl bg-white shadow-xl border border-pink-100 overflow-hidden z-50 animate-fadeIn">
          <div className="py-1 border-b border-gray-100">
            <p className="px-4 py-1 text-xs font-bold text-gray-400">並べ替え</p>
            <button
              className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                sortType === "manual" && !deleteMode ? "bg-pink-50 text-pink-600" : "hover:bg-pink-50 text-gray-700"
              }`}
              onClick={() => {
                setSortType("manual");
                setDeleteMode(false);
                setMenuOpen(false);
              }}
            >
              任意順 (手動)
            </button>
            <button
              className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                sortType === "salary" && !deleteMode ? "bg-pink-50 text-pink-600" : "hover:bg-pink-50 text-gray-700"
              }`}
              onClick={() => {
                setSortType("salary");
                setDeleteMode(false);
                setMenuOpen(false);
              }}
            >
              年収順
            </button>
            <button
              className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                sortType === "created" && !deleteMode ? "bg-pink-50 text-pink-600" : "hover:bg-pink-50 text-gray-700"
              }`}
              onClick={() => {
                setSortType("created");
                setDeleteMode(false);
                setMenuOpen(false);
              }}
            >
              登録順
            </button>
          </div>

          <div className="py-1">
            <button
              className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${
                deleteMode ? "bg-red-50 text-red-600" : "hover:bg-pink-50 text-gray-700"
              }`}
              onClick={() => {
                setDeleteMode(!deleteMode);
                setSelectedDelete([]);
                setMenuOpen(false);
              }}
            >
              {deleteMode ? "削除モード終了" : "削除"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}