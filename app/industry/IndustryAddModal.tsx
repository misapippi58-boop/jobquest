"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { INDUSTRY_DB } from "../data/industryData";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddComplete: (small: string, large: string) => void;
};

export default function IndustryAddModal({ isOpen, onClose, onAddComplete }: Props) {
  const [step, setStep] = useState<"large" | "job" | "route">("large");
  const [selection, setSelection] = useState({ large: "", job: "", route: "" });

  if (!isOpen) return null;

  const resetAndClose = () => {
    onClose();
    setStep("large");
    setSelection({ large: "", job: "", route: "" });
  };

  const currentIndustryData = selection.large 
    ? (INDUSTRY_DB as Record<string, any>)[selection.large] 
    : null;
    
  const jobSelectionTitle = currentIndustryData?.selectionTitle || "職種・資格を選択";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto [-webkit-overflow-scrolling:touch]">
      <div className="fixed inset-0 bg-black/50" onClick={resetAndClose} />

      <div className="flex min-h-[calc(100vh+1px)] items-start justify-center p-4 pb-32">
        <div 
          className="relative bg-white w-full max-w-lg rounded-3xl p-6 mt-8 text-left shadow-xl z-10" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 mb-6">
            {step !== "large" && (
              <button 
                onClick={() => {
                  if (step === "route") {
                    setStep("job");
                    setSelection({ ...selection, route: "" });
                  } else if (step === "job") {
                    setStep("large");
                    setSelection({ ...selection, job: "" });
                  }
                }} 
                className="text-gray-400 hover:text-pink-500 transition-colors p-1 -ml-1"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-800">
              {step === "large" && "業界・分野を選択"}
              {step === "job" && jobSelectionTitle}
              {step === "route" && "具体的な詳細・ルートを選択"}
            </h2>
          </div>

          {/* ステップ1：大分類 */}
          {step === "large" && (
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(INDUSTRY_DB) as string[]).map((largeName) => (
                <button 
                  key={largeName} 
                  onClick={() => { 
                    setSelection({ ...selection, large: largeName }); 
                    setStep("job"); 
                  }} 
                  className="p-5 bg-white border border-pink-100 rounded-2xl font-bold hover:border-pink-300 text-left transition-colors flex justify-between items-center"
                >
                  <span>{largeName}</span>
                  <span className="text-gray-300">›</span>
                </button>
              ))}
            </div>
          )}

          {/* ステップ2：中分類（職種・分野） */}
          {step === "job" && (
            <div className="grid grid-cols-2 gap-3">
              {selection.large && currentIndustryData?.jobs ? (
                (Object.keys(currentIndustryData.jobs) as string[]).map((jobName) => (
                  <button 
                    key={jobName} 
                    onClick={() => {
                      setSelection({ ...selection, job: jobName });
                      setStep("route");
                    }} 
                    className="p-4 rounded-2xl font-bold border bg-white border-pink-100 hover:border-pink-300 text-left text-sm transition-all flex flex-col justify-between"
                  >
                    <span>{jobName}</span>
                    <span className="text-xs text-pink-500 mt-2 font-normal">詳細を選ぶ ›</span>
                  </button>
                ))
              ) : <p className="text-sm text-gray-400">データがありません</p>}
            </div>
          )}

          {/* ステップ3：ルート・詳細プレビュー */}
          {step === "route" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {selection.large && selection.job && currentIndustryData?.jobs?.[selection.job]?.routes && (
                  (Object.keys(currentIndustryData.jobs[selection.job].routes) as string[]).map((routeName) => (
                    <button 
                      key={routeName} 
                      onClick={() => setSelection({ ...selection, route: routeName })} 
                      className={`p-4 rounded-2xl font-bold border text-left text-sm transition-all ${
                        selection.route === routeName 
                          ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm" 
                          : "bg-white border-pink-100 hover:border-pink-300 text-gray-700"
                      }`}
                    >
                      {routeName}
                    </button>
                  ))
                )}
              </div>

              {selection.route && (() => {
                const routeInfo = currentIndustryData?.jobs?.[selection.job]?.routes?.[selection.route];
                if (!routeInfo) return null;
                return (
                  <Card className="bg-pink-50/50 border-pink-100 p-4 space-y-3 mt-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-0.5">📋 仕事内容</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{routeInfo.description}</p>
                    </div>
                    {routeInfo.salary && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 mb-0.5">💰 年収目安</p>
                        <p className="text-sm font-bold text-pink-600">{routeInfo.salary}</p>
                      </div>
                    )}
                    {routeInfo.companies && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 mb-0.5">🏢 主な企業・タイプ</p>
                        <p className="text-sm text-gray-700">{routeInfo.companies}</p>
                      </div>
                    )}
                    <Button 
                      onClick={() => {
                        onAddComplete(selection.route, selection.large);
                        resetAndClose();
                      }} 
                      className="w-full mt-2" 
                      variant="pink"
                    >
                      「{selection.route}」を登録する
                    </Button>
                  </Card>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}