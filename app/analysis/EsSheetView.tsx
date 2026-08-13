"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Trash2, History, ArrowLeft, Edit3 } from "lucide-react";
import { DiagnosisResult, SelfAnalysisData, HistoryItem } from "../lib/diagnosis";

interface EsSheetViewProps {
  diagnosisResult: DiagnosisResult | null;
  currentIndustryLabel: string;
  data: SelfAnalysisData;
  onUpdateField: (field: keyof SelfAnalysisData, value: string) => void;
  onGoToQuiz: () => void;
  onPartialRetake?: () => void; // 追加：ガクチカ＆将来のビジョンだけを再入力する処理
  histories: HistoryItem[];
  activeHistoryId: string | null;
  onLoadHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string) => void;
}

export default function EsSheetView({
  diagnosisResult,
  currentIndustryLabel,
  data,
  onUpdateField,
  onGoToQuiz,
  onPartialRetake,
  histories,
  activeHistoryId,
  onLoadHistory,
  onDeleteHistory,
}: EsSheetViewProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!diagnosisResult) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-pink-200 text-center space-y-4">
        <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          📝
        </div>
        <h2 className="text-xl font-black text-gray-800">まだESシートが作成されていません</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          「16タイプ診断」タブから質問に答えて、あなたにぴったりの自己分析とES文章を自動生成しよう！
        </p>
        <button
          onClick={onGoToQuiz}
          className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-xl shadow-md transition inline-flex items-center gap-2"
        >
          診断を始める <Sparkles className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. 診断結果サマリーカード */}
      <div className="bg-white border-2 border-pink-200 p-6 rounded-3xl shadow-sm relative overflow-hidden space-y-4">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-5 text-9xl font-black text-pink-600 pointer-events-none">
          {diagnosisResult.typeCode}
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full font-bold">
                志望業界: {currentIndustryLabel}
              </span>
              <span className="bg-pink-600 text-white text-xs px-3 py-1 rounded-full font-extrabold">
                タイプ: {diagnosisResult.typeCode}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-wide">{diagnosisResult.typeName}</h2>
            <p className="text-xs text-gray-600 font-medium mt-1">
              おすすめの役割・職種: <span className="font-bold text-pink-600 underline">{diagnosisResult.recommendedRole}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-100">
              <div className="font-bold text-pink-700 mb-1">💡 特徴・アドバイス</div>
              <p className="text-gray-700 leading-relaxed">{diagnosisResult.advice}</p>
            </div>
            <div className="bg-pink-50/70 p-3.5 rounded-2xl border border-pink-100">
              <div className="font-bold text-pink-700 mb-1">✍️ ESアピールのコツ</div>
              <p className="text-gray-700 leading-relaxed">{diagnosisResult.esTip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. エントリーシートセクション */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-pink-200 space-y-6">
        <div className="flex justify-between items-center border-b border-pink-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-pink-600" />
              エントリーシート（ES）作成・編集
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              書き換え可能
            </p>
          </div>
          <button
            onClick={onPartialRetake || onGoToQuiz}
            className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-xl transition"
            title="学生時代に頑張ったことと将来のビジョンだけやり直す"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 再診断
          </button>
        </div>

        <div className="space-y-6">
          {/* 志望動機 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> 志望動機
              </label>
              <button
                onClick={() => handleCopy(data.motivation, "motivation")}
                className="flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg transition"
              >
                {copiedField === "motivation" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedField === "motivation" ? "コピー完了！" : "文章をコピー"}
              </button>
            </div>
            <textarea
              value={data.motivation}
              onChange={(e) => onUpdateField("motivation", e.target.value)}
              rows={4}
              className="w-full p-4 border border-pink-200 rounded-2xl text-xs text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
              placeholder="志望動機を入力..."
            />
          </div>

          {/* 自己PR・強み */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> 自己PR・あなたの強み
              </label>
              <button
                onClick={() => handleCopy(data.strengths, "strengths")}
                className="flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg transition"
              >
                {copiedField === "strengths" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedField === "strengths" ? "コピー完了！" : "文章をコピー"}
              </button>
            </div>
            <textarea
              value={data.strengths}
              onChange={(e) => onUpdateField("strengths", e.target.value)}
              rows={4}
              className="w-full p-4 border border-pink-200 rounded-2xl text-xs text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
              placeholder="自己PR・強みを入力..."
            />
          </div>

          {/* 学生時代に力を入れたこと（ガクチカ） */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> 学生時代に力を入れたこと（ガクチカ）
              </label>
              <button
                onClick={() => handleCopy(data.experiences, "experiences")}
                className="flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg transition"
              >
                {copiedField === "experiences" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedField === "experiences" ? "コピー完了！" : "文章をコピー"}
              </button>
            </div>
            <textarea
              value={data.experiences}
              onChange={(e) => onUpdateField("experiences", e.target.value)}
              rows={4}
              className="w-full p-4 border border-pink-200 rounded-2xl text-xs text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
              placeholder="学生時代に力を入れたことを入力..."
            />
          </div>

          {/* 将来のビジョン・キャリアプラン */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> 将来のビジョン・キャリアプラン
              </label>
              <button
                onClick={() => handleCopy(data.careerGoal, "careerGoal")}
                className="flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg transition"
              >
                {copiedField === "careerGoal" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedField === "careerGoal" ? "コピー完了！" : "文章をコピー"}
              </button>
            </div>
            <textarea
              value={data.careerGoal}
              onChange={(e) => onUpdateField("careerGoal", e.target.value)}
              rows={4}
              className="w-full p-4 border border-pink-200 rounded-2xl text-xs text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30"
              placeholder="将来のビジョンを入力..."
            />
          </div>
        </div>
      </div>

      {/* 3. 過去の履歴セクション */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-200 space-y-3">
        <h3 className="text-xs font-black text-gray-800 flex items-center gap-2">
          <History className="w-4 h-4 text-pink-600" />
          過去の履歴
        </h3>

        {histories.length === 0 ? (
          <p className="text-xs text-gray-400">保存された履歴はありません。</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {histories.map((item) => {
              const isActive = item.id === activeHistoryId;
              return (
                <div
                  key={item.id}
                  onClick={() => onLoadHistory(item)}
                  className={`cursor-pop-pointer px-3.5 py-2 rounded-2xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                      : "bg-pink-50/50 text-gray-700 border-pink-200 hover:bg-pink-100"
                  }`}
                >
                  <span>{item.diagnosisResult.typeCode}</span>
                  <span className={`text-[10px] ${isActive ? "text-pink-100" : "text-gray-500"}`}>
                    ({item.industryName})
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistory(item.id);
                    }}
                    className={`p-1 rounded-full hover:bg-black/10 transition ${
                      isActive ? "text-white" : "text-gray-400 hover:text-rose-500"
                    }`}
                    title="削除"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}