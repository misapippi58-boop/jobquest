import { useState } from "react";
import { MoreVertical } from "lucide-react";
import Button from "./Button";

// 外（page.tsx）から受け取る「命令（関数）」の型を定義します
interface ActionMenuProps {
  onSortChange: (mode: string) => void;
  onAddNew: () => void;
}

export const ActionMenu = ({ onSortChange, onAddNew }: ActionMenuProps) => {
  // page.tsx にあった「メニューの開閉状態」をここに引っ越し！
  const [menuOpen, setMenuOpen] = useState(false);

  // 並び替えボタンを押したときの共通処理
  const handleSort = (mode: string) => {
    onSortChange(mode);
    setMenuOpen(false); // 選んだらメニューを閉じる
  };

  return (
    <div className="relative flex flex-col gap-2">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="h-11 w-11 rounded-2xl bg-white border border-pink-100 shadow flex items-center justify-center"
      >
        <MoreVertical size={18} />
      </button>

      <Button variant="pink" onClick={onAddNew} className="h-11 w-11 p-0">
        ＋
      </Button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-0 right-14 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50 min-w-[160px]">
            <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("created")}>登録順</button>
            <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("priority")}>志望度順</button>
            <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("progress")}>進捗順</button>
            <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("schedule")}>スケジュール順</button>
            <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("name")}>企業名順</button>
            <button className="block w-full px-4 py-3 text-left hover:bg-pink-50" onClick={() => handleSort("manual")}>任意順</button>
          </div>
        </>
      )}
    </div>
  );
};