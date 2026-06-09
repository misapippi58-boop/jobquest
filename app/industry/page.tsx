"use client";

import { useState, useEffect } from "react";
import Button from "../ui/Button";
import CompanyCard from "../CompanyCard";
import { Company } from "../types/company";
import { INDUSTRY_DB } from "../data/industryData";
import { Trash2 } from "lucide-react";

export default function IndustryPage() {
  const [step, setStep] = useState<"large" | "small">("large");
  const [cards, setCards] = useState<Company[]>([]);
  const [selection, setSelection] = useState({ large: "", small: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<string | null>(null);
  const [note, setNote] = useState("");

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

  const handleSelectComplete = (small: string) => {
    if (cards.find((c) => c.name === small)) {
      alert("この職種は既に登録されています");
      return;
    }
    const newCard: Company = {
      id: Date.now().toString(),
      name: small,
      industry: selection.large,
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
    setStep("large");
    setSelection({ large: "", small: "" });
  };

  return (
    <main className="min-h-screen bg-pink-50 p-6 pb-32">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-black mb-8 text-gray-800">業界研究</h1>
        <Button onClick={() => setIsModalOpen(true)} className="w-full mb-8 font-bold" variant="pink">
          + 興味のある業界・職種を追加
        </Button>

        {/* カード一覧 */}
        <div className="grid gap-4">
          {cards.map((card) => (
            <CompanyCard
              key={card.id}
              company={card}
              onOpen={() => {
                setSelectedJobForDetail(card.name);
                setNote(card.memo || "");
              }}
              onEdit={() => {}}
              dragEnabled={false}
              showDetails={false}
              showEditButton={false}
            />
          ))}
        </div>

        {/* 選択モーダル */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-6">業界・職種を選択</h2>
              {step === "large" ? (
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(INDUSTRY_DB) as Array<keyof typeof INDUSTRY_DB>).map((name) => (
                    <button key={name} onClick={() => { setSelection({ ...selection, large: name }); setStep("small"); }} className="p-6 bg-white border border-pink-100 rounded-3xl font-bold hover:border-pink-300 text-left">
                      {name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <button onClick={() => setStep("large")} className="text-sm text-gray-400 underline">←戻る</button>
                  {selection.large && INDUSTRY_DB[selection.large as keyof typeof INDUSTRY_DB]?.specializedJobs ? (
                    Object.keys(INDUSTRY_DB[selection.large as keyof typeof INDUSTRY_DB].specializedJobs).map((jobName) => (
                      <button key={jobName} onClick={() => setSelection({ ...selection, small: jobName })} className={`w-full p-4 rounded-2xl font-bold border-2 text-left ${selection.small === jobName ? "border-pink-500 bg-pink-50 text-pink-700" : "bg-gray-50 hover:bg-gray-100"}`}>
                        {jobName}
                      </button>
                    ))
                  ) : <p>データがありません</p>}
                  {selection.small && <Button onClick={() => handleSelectComplete(selection.small)} className="w-full" variant="pink">登録する</Button>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 詳細モーダル */}
        {selectedJobForDetail && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedJobForDetail(null)}>
            <div className="bg-white w-full max-w-lg rounded-3xl p-8 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                let foundJob: any = null;
                Object.values(INDUSTRY_DB).forEach((industry: any) => {
                  if (industry.specializedJobs && industry.specializedJobs[selectedJobForDetail]) {
                    foundJob = industry.specializedJobs[selectedJobForDetail];
                  }
                });
                if (!foundJob) return <p>データが見つかりません</p>;
                return (
                  <div className="space-y-4 relative">
                    <button onClick={() => { const filtered = cards.filter((c) => c.name !== selectedJobForDetail); setCards(filtered); localStorage.setItem("my-industry-cards", JSON.stringify(filtered)); setSelectedJobForDetail(null); }} className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500">
                      <Trash2 size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-pink-600 pr-8">{selectedJobForDetail}</h2>
                    <p className="font-bold text-gray-500">仕事内容</p>
                    <p>{foundJob.description}</p>
                    <p className="font-bold text-gray-500">年収目安</p>
                    <p>{foundJob.salary}</p>
                    <p className="font-bold text-gray-500 pt-4">memo</p>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-4 rounded-2xl bg-pink-50 border-none min-h-[100px] text-sm" placeholder="メモを入力..." />
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => { const updated = cards.map(c => c.name === selectedJobForDetail ? {...c, memo: note} : c); setCards(updated); localStorage.setItem("my-industry-cards", JSON.stringify(updated)); alert("保存しました"); }} className="flex-1" variant="pink">保存する</Button>
                      <Button onClick={() => setSelectedJobForDetail(null)} className="flex-1" variant="white">閉じる</Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}