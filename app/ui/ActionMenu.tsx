import { useState, useEffect, useRef } from "react"; // 1. useRef, useEffect を追加
import { MoreVertical } from "lucide-react";
import Button from "./Button";

interface ActionMenuProps {
  onSortChange: (mode: string) => void;
  onAddNew: () => void;
}

export const ActionMenu = ({ onSortChange, onAddNew }: ActionMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // 2. リファレンスを作成

  // 3. 外側クリックを検知する処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // メニューの範囲外がクリックされたら閉じる
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
  }, [menuOpen]);

  const handleSort = (mode: string) => {
    onSortChange(mode);
    setMenuOpen(false);
  };

  return (
    // 4. 親要素に ref={menuRef} を設定（ここ全体が監視対象になります）
    <div className="relative flex flex-row gap-2" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="h-11 w-11 rounded-2xl bg-white border border-pink-100 shadow flex items-center justify-center"
      >
        <MoreVertical size={18} />
      </button>

      <Button variant="pink" onClick={onAddNew} className="h-11 w-11 p-0">
        ＋
      </Button>

      {/* 5. 画面全体を覆う overlay div を削除してスッキリ！ */}
      {menuOpen && (
        <div className="absolute top-0 right-14 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50 min-w-[160px]">
          <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("created")}>登録順</button>
          <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("priority")}>志望度順</button>
          <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("progress")}>進捗順</button>
          <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("schedule")}>スケジュール順</button>
          <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("name")}>企業名順</button>
          <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("manual")}>任意順</button>
        </div>
      )}
    </div>
  );
};