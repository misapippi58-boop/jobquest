"use client";

import { Sparkles, ArrowRight, Check } from "lucide-react";
import { questions, gakuchikaOptions, careerGoalOptions } from "../data/quizData";
import { INDUSTRY_DB } from "../data/industryData";

interface QuizViewProps {
  step: "select_industry" | "answering" | "select_elements";
  selectedIndustry: string;
  setSelectedIndustry: (id: string) => void;
  currentQIndex: number;
  onAnswer: (value: string) => void;
  onStartQuiz: () => void;
  selectedGakuchika: string[];
  toggleGakuchika: (label: string) => void;
  gakuchikaDetail: string;
  setGakuchikaDetail: (val: string) => void;
  selectedCareerGoals: string[];
  toggleCareerGoal: (label: string) => void;
  onCompleteQuiz: () => void;
  onResetQuiz: () => void;
}

export default function QuizView({
  step,
  selectedIndustry,
  setSelectedIndustry,
  currentQIndex,
  onAnswer,
  onStartQuiz,
  selectedGakuchika,
  toggleGakuchika,
  gakuchikaDetail,
  setGakuchikaDetail,
  selectedCareerGoals,
  toggleCareerGoal,
  onCompleteQuiz,
  onResetQuiz,
}: QuizViewProps) {
  const broadIndustries = Object.keys(INDUSTRY_DB);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-200">
      {/* 1. 業界選択ステップ */}
      {step === "select_industry" && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-gray-800">業界選択</h2>
            <p className="text-xs text-gray-500">性格と志望業界に合わせたES文章生成</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {broadIndustries.map((industryName) => (
              <button
                key={industryName}
                type="button"
                onClick={() => setSelectedIndustry(industryName)}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition truncate ${
                  selectedIndustry === industryName
                    ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                    : "bg-white text-gray-700 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
                }`}
              >
                {industryName}
              </button>
            ))}

            {/* まだ決まっていないボタン */}
            <button
              type="button"
              onClick={() => setSelectedIndustry("まだ決まっていない")}
              className={`p-3 rounded-xl border text-center text-xs font-bold transition truncate col-span-2 sm:col-span-1 ${
                selectedIndustry === "まだ決まっていない"
                  ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                  : "bg-white text-gray-700 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
              }`}
            >
              💭 まだ決まっていない
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={onStartQuiz}
              disabled={!selectedIndustry}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition ${
                selectedIndustry ? "bg-pink-600 hover:bg-pink-700 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              診断を始める <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. 16タイプ質問ステップ */}
      {step === "answering" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-bold text-pink-600">
            <span>質問 {currentQIndex + 1} / {questions.length}</span>
            <button onClick={onResetQuiz} className="text-gray-400 hover:text-gray-600 text-xs">最初からやり直す</button>
          </div>

          <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-pink-600 h-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="py-4 text-center">
            <h3 className="text-lg font-bold text-gray-800 leading-relaxed">
              {questions[currentQIndex].text}
            </h3>
          </div>

          <div className="space-y-3">
            {questions[currentQIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onAnswer(opt.value)}
                className="w-full p-4 rounded-2xl border border-pink-200 bg-white hover:bg-pink-50 hover:border-pink-400 text-gray-700 text-sm font-bold text-left transition shadow-sm flex items-center justify-between"
              >
                <span>{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-pink-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. ガクチカ詳細 ＆ 将来ビジョン選択ステップ */}
      {step === "select_elements" && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-gray-800">✨ ガクチカ ＆ ビジョンの深掘り</h2>
            <p className="text-xs text-gray-500">
              わかる範囲で選んだり、自由に入力箱に書いてね（空欄のままでも進めます）！
            </p>
          </div>

          <div className="space-y-6 pt-2">
            {/* ガクチカセクション */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-pink-700">
                📌 学生時代に力を入れたこと（テーマを選択）
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gakuchikaOptions.map((item) => {
                  const isSelected = selectedGakuchika.includes(item.label);
                  return (
                    <div key={item.id} className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => toggleGakuchika(item.label)}
                        className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                          isSelected
                            ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                            : "bg-white text-gray-700 border-pink-200 hover:bg-pink-50"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>

                      {isSelected && item.subOptions && (
                        <div className="pl-2 flex flex-wrap gap-1.5 pt-1">
                          {item.subOptions.map((sub, sIdx) => {
                            const isSubSelected = gakuchikaDetail.includes(sub);
                            return (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => {
                                  if (isSubSelected) {
                                    setGakuchikaDetail(gakuchikaDetail.replace(sub, "").trim());
                                  } else {
                                    setGakuchikaDetail(gakuchikaDetail ? `${gakuchikaDetail}・${sub}` : sub);
                                  }
                                }}
                                className={`text-[10px] px-2.5 py-1 rounded-lg border transition font-medium ${
                                  isSubSelected
                                    ? "bg-pink-700 text-white border-pink-700"
                                    : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                                }`}
                              >
                                + {sub}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 自由に入力できる箱 */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  ✏️ ガクチカの具体的な内容や自由メモ（任意・入力の箱）
                </label>
                <input
                  type="text"
                  value={gakuchikaDetail}
                  onChange={(e) => setGakuchikaDetail(e.target.value)}
                  placeholder="例：接客アルバイトでの売上向上施策、チームでのイベント運営など自由に記載..."
                  className="w-full p-3 border border-pink-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                />
              </div>
            </div>

            {/* 将来ビジョンセクション */}
            <div className="space-y-3 pt-4 border-t border-pink-100">
              <label className="block text-xs font-bold text-pink-700">
                🎯 将来のビジョンの方向性（複数選択OK・汎用的な選択肢）
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {careerGoalOptions.map((item) => {
                  const isSelected = selectedCareerGoals.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleCareerGoal(item.label)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                        isSelected
                          ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                          : "bg-white text-gray-700 border-pink-200 hover:bg-pink-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={onCompleteQuiz}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md transition"
            >
              ESシートを作成する <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}