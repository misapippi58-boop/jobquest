"use client";

import { useState, useEffect } from "react";
import { Sparkles, HelpCircle, LayoutList } from "lucide-react";
import BottomNav from "../ui/BottomNav";
import QuizView from "./QuizView";
import EsSheetView from "./EsSheetView";
import { calculateDiagnosisResult, DiagnosisResult, SelfAnalysisData, HistoryItem } from "../lib/diagnosis";
import { questions, industries } from "../data/quizData";

const STORAGE_KEY = "self_analysis_histories_v2";
const TAB_STORAGE_KEY = "self_analysis_active_tab";

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<"quiz" | "sheet">("quiz");

  const handleTabChange = (tab: "quiz" | "sheet") => {
    setActiveTab(tab);
    localStorage.setItem(TAB_STORAGE_KEY, tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [step, setStep] = useState<"select_industry" | "answering" | "select_elements">("select_industry");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  // ガクチカ＆将来ビジョンの選択状態 ＋ 自由入力の箱
  const [selectedGakuchika, setSelectedGakuchika] = useState<string[]>([]);
  const [gakuchikaDetail, setGakuchikaDetail] = useState<string>("");
  const [selectedCareerGoals, setSelectedCareerGoals] = useState<string[]>([]);

  // ★追加：AIの生成中（ローディング）ステート
  const [isLoading, setIsLoading] = useState(false);

  // 📂 履歴と選択中IDのステート
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [currentIndustryLabel, setCurrentIndustryLabel] = useState<string>("一般・未選択");

  const activeHistory = histories.find((h) => h.id === activeHistoryId) || null;
  const currentEsData: SelfAnalysisData = activeHistory
    ? activeHistory.esData
    : { motivation: "", strengths: "", experiences: "", careerGoal: "" };

  useEffect(() => {
    const savedTab = localStorage.getItem(TAB_STORAGE_KEY);
    if (savedTab === "quiz" || savedTab === "sheet") {
      setActiveTab(savedTab);
    }

    const savedHistories = localStorage.getItem(STORAGE_KEY);
    if (savedHistories) {
      try {
        const parsed: HistoryItem[] = JSON.parse(savedHistories);
        setHistories(parsed);
        if (parsed.length > 0) {
          const first = parsed[0];
          setActiveHistoryId(first.id);
          setDiagnosisResult(first.diagnosisResult);
          setCurrentIndustryLabel(first.industryName);

          const anyItem = first as any;
          if (anyItem.selectedIndustry) setSelectedIndustry(anyItem.selectedIndustry);
          if (anyItem.selectedGakuchika) setSelectedGakuchika(anyItem.selectedGakuchika);
          if (anyItem.selectedCareerGoals) setSelectedCareerGoals(anyItem.selectedCareerGoals);
          if (anyItem.gakuchikaDetail) setGakuchikaDetail(anyItem.gakuchikaDetail);
        }
      } catch (e) {
        console.error("履歴の読み込みに失敗しました", e);
      }
    }
  }, []);

  const handleUpdateField = (field: keyof SelfAnalysisData, value: string) => {
    if (!activeHistoryId) return;

    const updatedHistories = histories.map((item) => {
      if (item.id === activeHistoryId) {
        return {
          ...item,
          esData: {
            ...item.esData,
            [field]: value,
          },
        };
      }
      return item;
    });

    setHistories(updatedHistories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistories));
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setActiveHistoryId(item.id);
    setDiagnosisResult(item.diagnosisResult);
    setCurrentIndustryLabel(item.industryName);

    const anyItem = item as any;
    if (anyItem.selectedIndustry) {
      setSelectedIndustry(anyItem.selectedIndustry);
    } else {
      const found = industries.find((i) => i.name === item.industryName);
      if (found) setSelectedIndustry(found.id);
    }

    if (anyItem.selectedGakuchika) setSelectedGakuchika(anyItem.selectedGakuchika);
    if (anyItem.selectedCareerGoals) setSelectedCareerGoals(anyItem.selectedCareerGoals);
    if (anyItem.gakuchikaDetail) setGakuchikaDetail(anyItem.gakuchikaDetail);

    handleTabChange("sheet");
  };

  const handleDeleteHistory = (id: string) => {
    const updated = histories.filter((h) => h.id !== id);
    setHistories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (activeHistoryId === id) {
      if (updated.length > 0) {
        setActiveHistoryId(updated[0].id);
        setDiagnosisResult(updated[0].diagnosisResult);
        setCurrentIndustryLabel(updated[0].industryName);
      } else {
        setActiveHistoryId(null);
        setDiagnosisResult(null);
      }
    }
  };

  const handleAnswer = (value: string) => {
    const updatedAnswers = { ...answers, [value]: answers[value] + 1 };
    setAnswers(updatedAnswers);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setStep("select_elements");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleGakuchika = (label: string) => {
    if (selectedGakuchika.includes(label)) {
      setSelectedGakuchika(selectedGakuchika.filter((item) => item !== label));
    } else {
      setSelectedGakuchika([...selectedGakuchika, label]);
    }
  };

  const toggleCareerGoal = (label: string) => {
    if (selectedCareerGoals.includes(label)) {
      setSelectedCareerGoals(selectedCareerGoals.filter((item) => item !== label));
    } else {
      setSelectedCareerGoals([...selectedCareerGoals, label]);
    }
  };

  const resetQuizState = () => {
    setStep("select_industry");
    setSelectedIndustry("");
    setCurrentQIndex(0);
    setAnswers({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setSelectedGakuchika([]);
    setGakuchikaDetail("");
    setSelectedCareerGoals([]);
  };

  const handlePartialRetake = () => {
    if (!selectedIndustry && activeHistory) {
      const found = industries.find((i) => i.name === activeHistory.industryName);
      if (found) {
        setSelectedIndustry(found.id);
      }
    }

    setStep("select_elements");
    handleTabChange("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompleteQuiz = async () => {
    const selectedObj = industries.find((i) => i.id === selectedIndustry);
    const industryLabel = selectedObj ? selectedObj.name : (selectedIndustry || "一般・未選択");
    setCurrentIndustryLabel(industryLabel);

    // 1. 性格診断結果を計算
    const { result } = calculateDiagnosisResult(
      answers,
      selectedIndustry,
      industryLabel,
      selectedGakuchika,
      gakuchikaDetail,
      selectedCareerGoals
    );
    setDiagnosisResult(result);

    // 2. ローディング開始（AIが考えている間クルクルを表示）
    setIsLoading(true);

    let aiGeneratedEsText = "";

    try {
      const res = await fetch("/api/generate-es", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: industryLabel,
          gakuchikaList: selectedGakuchika,
          gakuchikaDetail: gakuchikaDetail,
          careerGoals: selectedCareerGoals,
          personalityType: (result as any).type || "INFP型",
        }),
      });

      const data = await res.json();
      if (data.esText) {
        aiGeneratedEsText = data.esText;
      }
    } catch (e) {
      console.error("AI生成エラー:", e);
      aiGeneratedEsText = "通信エラーが発生したため、AIによる自動生成に失敗しました。手動で入力・編集してください。";
    } finally {
      setIsLoading(false);
    }

    // 3. AIが作った文章を履歴の初期データ（esData）にセットする
    const initialEsData: SelfAnalysisData = {
      motivation: aiGeneratedEsText,
      strengths: `私の性格タイプは ${(result as any).type || "INFP型"} です。${(result as any).title || "強み"}としての強みを活かします。`, // ← ここも修正済み
      experiences: selectedGakuchika.join("、") + (gakuchikaDetail ? `（${gakuchikaDetail}）` : ""),
      careerGoal: selectedCareerGoals.join("、"),
    };

    const now = new Date().toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    const newId = Date.now().toString();
    
    const newItem: HistoryItem = {
      id: newId,
      createdAt: now,
      industryName: industryLabel,
      diagnosisResult: result,
      esData: initialEsData,
      selectedIndustry: selectedIndustry,
      selectedGakuchika: selectedGakuchika,
      selectedCareerGoals: selectedCareerGoals,
      gakuchikaDetail: gakuchikaDetail,
    } as any;

    const updatedHistories = [newItem, ...histories];
    setHistories(updatedHistories);
    setActiveHistoryId(newId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistories));

    resetQuizState();
    handleTabChange("sheet");
  };

  return (
    <main className="min-h-screen bg-pink-50 p-6 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-600" />
              就活16タイプ診断 ＆ ES自己分析
            </h1>
          </div>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-pink-200 mb-8 max-w-md">
          <button
            onClick={() => handleTabChange("quiz")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition ${
              activeTab === "quiz" ? "bg-pink-600 text-white shadow-sm" : "text-gray-600 hover:bg-pink-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            🤖 16タイプ診断
          </button>
          <button
            onClick={() => handleTabChange("sheet")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition ${
              activeTab === "sheet" ? "bg-pink-600 text-white shadow-sm" : "text-gray-600 hover:bg-pink-50"
            }`}
          >
            <LayoutList className="w-4 h-4" />
            📝 ESシート ＆ 履歴
          </button>
        </div>

        {activeTab === "quiz" && (
          <QuizView
            step={step}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            currentQIndex={currentQIndex}
            onAnswer={handleAnswer}
            onStartQuiz={() => {
              setStep("answering");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            selectedGakuchika={selectedGakuchika}
            toggleGakuchika={toggleGakuchika}
            gakuchikaDetail={gakuchikaDetail}
            setGakuchikaDetail={setGakuchikaDetail}
            selectedCareerGoals={selectedCareerGoals}
            toggleCareerGoal={toggleCareerGoal}
            onCompleteQuiz={handleCompleteQuiz}
            onResetQuiz={resetQuizState}
          />
        )}

        {activeTab === "sheet" && (
          <EsSheetView
            diagnosisResult={diagnosisResult}
            currentIndustryLabel={currentIndustryLabel}
            data={currentEsData}
            onUpdateField={handleUpdateField}
            onGoToQuiz={() => {
              resetQuizState();
              handleTabChange("quiz");
            }}
            onPartialRetake={handlePartialRetake}
            histories={histories}
            activeHistoryId={activeHistoryId}
            onLoadHistory={handleLoadHistory}
            onDeleteHistory={(id) => handleDeleteHistory(id)}
          />
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white space-y-4">
          <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold tracking-wider animate-pulse">
            ✨ AIがあなた専用のES文章を執筆中...
          </p>
        </div>
      )}

      <BottomNav />
    </main>
  );
}