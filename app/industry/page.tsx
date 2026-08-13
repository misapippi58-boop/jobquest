"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { DragEndEvent } from "@dnd-kit/core";
import { Company } from "../types/company";
import IndustryMenu from "./IndustryMenu";
import IndustryCardList from "./IndustryCardList";
import IndustryAddModal from "./IndustryAddModal";
import IndustryDetailModal from "./IndustryDetailModal";
import { moveCard, sortIndustryCards } from "./lib/sortIndustry";
import Button from "../ui/Button";

export default function IndustryPage() {
  const [cards, setCards] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<string | null>(null);
  
  const [sortType, setSortType] = useState<"manual" | "salary" | "created">("manual");
  const [menuOpen, setMenuOpen] = useState(false);

  // 削除モードの状態
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<string[]>([]);

  // 初期読み込み
  useEffect(() => {
    const savedCards = localStorage.getItem("my-industry-cards");
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (e) {
        console.error("データ読み込み失敗", e);
      }
    }
  }, []);

  // 安全な body ロック
  useEffect(() => {
    if (isModalOpen || selectedJobForDetail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, selectedJobForDetail]);

  // ドラッグ終了（任意順かつ非削除モードの時のみ有効）
  const handleDragEnd = (event: DragEndEvent) => {
    if (sortType !== "manual" || deleteMode) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sortedCards = moveCard(cards, String(active.id), String(over.id));
    setCards(sortedCards);
    localStorage.setItem("my-industry-cards", JSON.stringify(sortedCards));
  };

  // 追加完了
  const handleAddComplete = (small: string, large: string) => {
    if (cards.find((c) => c.name === small)) {
      alert("この職種は既に登録されています");
      return;
    }
    const newCard: Company = {
      id: Date.now().toString(),
      name: small,
      industry: large,
      progress: "興味あり",
      priority: "中",
      url: "",
      schedule: [],
      foreignCountry: "",
      foreignCity: "",
      workLocation: "",
      employees: "",
      culture: "",
      strengths: "",
      memo: "",
    };
    const updated = [...cards, newCard];
    setCards(updated);
    localStorage.setItem("my-industry-cards", JSON.stringify(updated));
    setIsModalOpen(false);
  };

  // 単一削除（詳細モーダル内から）
  const handleDelete = (jobName: string) => {
    const filtered = cards.filter((c) => c.name !== jobName);
    setCards(filtered);
    localStorage.setItem("my-industry-cards", JSON.stringify(filtered));
    setSelectedJobForDetail(null);
  };

  // 選択切り替え（削除モード時）
  const handleToggleSelect = (id: string) => {
    setSelectedDelete((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 一括削除実行
  const handleBatchDelete = () => {
    if (selectedDelete.length === 0) return;
    if (!confirm(`選択した ${selectedDelete.length} 件の職種を削除しますか？`)) return;

    const updated = cards.filter((c) => !selectedDelete.includes(c.id));
    setCards(updated);
    localStorage.setItem("my-industry-cards", JSON.stringify(updated));
    setSelectedDelete([]);
    setDeleteMode(false);
  };

  // メモ保存
  const handleSaveNote = (jobName: string, note: string) => {
    const updated = cards.map((c) => (c.name === jobName ? { ...c, memo: note } : c));
    setCards(updated);
    localStorage.setItem("my-industry-cards", JSON.stringify(updated));
    alert("保存しました");
  };

  const displayCards = sortIndustryCards(cards, sortType);
  const currentCardMemo = cards.find((c) => c.name === selectedJobForDetail)?.memo || "";

  return (
    <main className="min-h-screen bg-pink-50 p-6 pb-32">
      <div className="max-w-xl mx-auto">
        
        {/* ヘッダーエリア */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">業界研究</h1>
            {deleteMode && (
              <p className="text-xs font-bold text-red-500 mt-1 animate-pulse">
                🗑️ 削除する職種を選択してください ({selectedDelete.length}件選択中)
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!deleteMode && (
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-sm hover:opacity-90 active:scale-95 transition-all"
                title="追加"
              >
                <Plus size={18} className="stroke-[3]" />
              </button>
            )}

            <IndustryMenu 
              menuOpen={menuOpen} 
              setMenuOpen={setMenuOpen} 
              sortType={sortType} 
              setSortType={setSortType} 
              deleteMode={deleteMode}
              setDeleteMode={setDeleteMode}
              setSelectedDelete={setSelectedDelete}
            />
          </div>
        </div>

        {/* カード一覧 */}
        <IndustryCardList 
          cards={displayCards} 
          sortMode={sortType === "manual"} 
          deleteMode={deleteMode}
          selectedDelete={selectedDelete}
          onToggleSelect={handleToggleSelect}
          onDragEnd={handleDragEnd} 
          onOpenDetail={(card) => setSelectedJobForDetail(card.name)} 
        />

        {/* 削除モード中の下部アクションバー */}
        {deleteMode && (
          <div className="fixed bottom-20 left-0 right-0 max-w-xl mx-auto px-6 z-40">
            <div className="bg-white/95 backdrop-blur border border-red-100 shadow-xl rounded-2xl p-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">
                {selectedDelete.length}件選択中
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setDeleteMode(false);
                    setSelectedDelete([]);
                  }}
                  variant="white"
                  className="text-xs py-2 px-4"
                >
                  キャンセル
                </Button>
                <button
                  onClick={handleBatchDelete}
                  disabled={selectedDelete.length === 0}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                    selectedDelete.length > 0 
                      ? "bg-red-500 hover:bg-red-600 shadow-sm" 
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  一括削除する
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 追加モーダル */}
        <IndustryAddModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAddComplete={handleAddComplete} 
        />

        {/* 詳細モーダル */}
        <IndustryDetailModal 
          jobName={selectedJobForDetail} 
          onClose={() => setSelectedJobForDetail(null)} 
          onDelete={handleDelete} 
          onSaveNote={handleSaveNote} 
          initialNote={currentCardMemo} 
        />

      </div>
    </main>
  );
}