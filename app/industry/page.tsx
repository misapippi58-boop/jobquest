"use client";

import Button from "../ui/Button";
import CompanyCard from "../CompanyCard";
import { Company } from "../types/company";
import { useState } from "react";
import { useEffect } from "react";
import { INDUSTRY_DB } from "../data/industryData";

export default function IndustryPage() {
  const [step, setStep] = useState<"large" | "small">("large");
  const [note, setNote] = useState("");
  const [cards, setCards] = useState<Company[]>([]);
  const [selection, setSelection] = useState({ large: "", small: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<string | null>(null);

  // 小分類が選択されたら、その職種の保存済みメモを読み込む
  useEffect(() => {
    const savedCards = localStorage.getItem("my-industry-cards");
    if (savedCards) {
      try {
        const parsed = JSON.parse(savedCards);
        // 万が一、データが古い形式（文字列のみ）だったら空配列にする
        if (Array.isArray(parsed) && parsed[0]?.id) {
          setCards(parsed);
        } else {
          localStorage.removeItem("my-industry-cards");
          setCards([]);
        }
      } catch (e) {
        setCards([]);
      }
    }
  }, []);

  // 業界選択確定時の処理
  const handleSelectComplete = (small: string) => {
    const currentIndustry = selection.large;

    if (!cards.find((c) => c.name === small)) {
      const newCard: Company = {
        id: Date.now().toString(),
        name: small,
        industry: currentIndustry,
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

      const updatedCards = [...cards, newCard];
      setCards(updatedCards);
      
      localStorage.setItem("my-industry-cards", JSON.stringify(updatedCards));
    }
    
    setSelection({ large: "", small: "" });
    setStep("large");
    setIsModalOpen(false);
  };

  // 1. 初回読み込み（マウント時）
  useEffect(() => {
    const savedCards = localStorage.getItem("my-industry-cards");
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);

// 1. 初回マウント時のみデータを読み込む
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

  // 2. cards が更新されるたびに保存する
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem("my-industry-cards", JSON.stringify(cards));
    }
  }, [cards]);

  return (
    <main className="min-h-screen bg-pink-50 p-6 pb-32">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-black mb-8 text-gray-800">業界研究</h1>

        {/* 1. 業界追加ボタン */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full mb-8 font-bold"
          variant="pink" 
        >
          + 興味のある業界・職種を追加
        </Button>

        {/* 業界カード一覧 */}
        <div className="grid gap-4">
          {cards.map((card) => (
            <CompanyCard
              key={card.id}
              company={card}
              onOpen={() => setSelectedJobForDetail(card.name)}
              onEdit={() => {}}
              dragEnabled={false}
              showDetails={false} 
              showEditButton={false}
            />
          ))}
        </div>

        {/* 3. モーダル本体 */}
        {isModalOpen && (
         <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsModalOpen(false); 
              setStep("large"); 
              setSelection({ large: "", small: "" });
            }}
          >
            <div 
              className="bg-white w-full max-w-lg rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} 
            >
              <h2 className="text-xl font-bold mb-6">業界・職種を選択</h2>

              {/* 1. 大分類（業界） */}
              {step === "large" && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(INDUSTRY_DB).map((industryName) => (
                    <button
                      key={industryName}
                      onClick={() => {
                        setSelection({ ...selection, large: industryName });
                        setStep("small");
                      }}
                      className="p-6 bg-white border border-pink-100 rounded-3xl font-bold hover:border-pink-300"
                    >
                      {industryName}
                    </button>
                  ))}
                </div>
              )}

              {/* 2. 小分類（職種） */}
              {step === "small" && (
                <div className="space-y-4">
                  <button onClick={() => setStep("large")} className="text-sm text-gray-400 underline">←戻る</button>
                  <h3 className="font-bold text-lg mb-4">職種を選んでください</h3>

                  {Object.keys(INDUSTRY_DB[selection.large as keyof typeof INDUSTRY_DB].jobs).map((jobName) => (
                    <button
                      key={jobName}
                      onClick={() => setSelection({ ...selection, small: jobName })}
                      className={`w-full p-4 rounded-2xl font-bold border-2 text-left ${
                        selection.small === jobName ? "border-pink-500 bg-pink-50 text-pink-700" : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {jobName}
                    </button>
                  ))}

                  {selection.small !== "" && (
                    <button
                      onClick={() => handleSelectComplete(selection.small)}
                      className="w-full mt-8 py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg"
                    >
                      この職種を登録する
                    </button>
                  )}
                </div>
              )}

              <button 
                onClick={() => { setIsModalOpen(false); setStep("large"); setSelection({large: "", small: ""}); }} 
                className="mt-6 w-full text-gray-400 text-sm"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* 詳細表示用モーダル */}
        {selectedJobForDetail && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedJobForDetail(null)}
          >
            <div className="bg-white w-full max-w-lg rounded-3xl p-8 max-h-[80vh] overflow-y-auto">
              {/* 職種データを探す */}
              {(() => {
                // 職種データを見つけるための検索処理
                let foundJob = null;
                Object.values(INDUSTRY_DB).forEach(industry => {
                  if (industry.jobs[selectedJobForDetail as keyof typeof industry.jobs]) {
                    foundJob = industry.jobs[selectedJobForDetail as keyof typeof industry.jobs];
                  }
                });

                if (!foundJob) return <p>データが見つかりません</p>;

                const { description, salary, majorCompanies } = foundJob as any;

                return (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-pink-600">{selectedJobForDetail}</h2>
                    
                    <div>
                      <h3 className="font-bold text-gray-500 mb-1">仕事内容</h3>
                      <p>{description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-gray-500 mb-1">年収目安</h3>
                      <p className="text-lg font-bold">{salary}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-500 mb-1">代表的な企業</h3>
                      <ul className="list-disc ml-4">
                        {majorCompanies.map((c: string) => <li key={c}>{c}</li>)}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-500 mb-2">自分専用メモ</h3>
                      <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-pink-50 border-none min-h-[120px] text-sm"
                        placeholder="志望動機や面接で聞きたいことなどをメモ..."
                      />

                      <div className="flex gap-3 mt-4">
                        <Button 
                          variant="pink" 
                          onClick={() => {
                            localStorage.setItem(`note-${selectedJobForDetail}`, note);
                            alert("保存しました！");
                          }}
                          className="flex-1"
                        >
                          保存する
                        </Button>
                        <Button 
                          variant="white"
                          onClick={() => setSelectedJobForDetail(null)}
                          className="flex-1"
                        >
                          閉じる
                        </Button>
                      </div>
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