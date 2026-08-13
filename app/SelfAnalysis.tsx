"use client";

import { useState } from "react";
import { Sparkles, CheckCircle, RefreshCw } from "lucide-react";

export default function SelfAnalysis() {
  const [answers, setAnswers] = useState({
    role: "",
    approach: "",
    source: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    strength: string;
    weakness: string;
    gakuchika: string;
  } | null>(null);

  const options = {
    role: [
      { id: "leader", label: "みんなを引っ張るリーダー・旗振り役" },
      { id: "support", label: "周りを見てサポート・調整役に回ることが多い" },
      { id: "lonely", label: "個人でコツコツと深く極めるのが好き" },
    ],
    approach: [
      { id: "logical", label: "原因を冷静に分析し、論理的に解決策を考える" },
      { id: "communicative", label: "周りの人に相談し、協力を仰いで一緒に乗り越える" },
      { id: "guts", label: "粘り強さと気合い・行動量でカバーする" },
    ],
    source: [
      { id: "parttime", label: "アルバイト・仕事（店舗運営や接客など）" },
      { id: "study", label: "学業・研究・資格の勉強" },
      { id: "circle", label: "サークル・部活・趣味の活動" },
    ],
  };

  const handleGenerate = () => {
    if (!answers.role || !answers.approach || !answers.source) {
      alert("すべての質問に答えてください！");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let generated = {
        strength: "",
        weakness: "",
        gakuchika: "",
      };

      if (answers.role === "leader") {
        generated.strength = "高い責任感と、周囲を巻き込んで目標を達成する統率力";
        generated.weakness = "責任を一人で背負い込みすぎて、メンバーに任せるのが苦手な面がある";
      } else if (answers.role === "support") {
        generated.strength = "高い傾聴力と、組織全体の潤滑油として動くバランス感覚";
        generated.weakness = "自己主張が控えめで、自分の意見を強く押し出すのが少し苦手";
      } else {
        generated.strength = "圧倒的な集中力と、困難な課題を一人でやり抜く自走力";
        generated.weakness = "視野が内向きになりやすく、周囲の意見を取り入れるのが遅れることがある";
      }

      generated.gakuchika = `${answers.source === "parttime" ? "アルバイト" : answers.source === "study" ? "学業・研究" : "サークル活動"}において、${answers.approach === "logical" ? "論理的な課題分析と改善策の実行" : answers.approach === "communicative" ? "周囲との密なコミュニケーションと協調" : "圧倒的な粘り強さと行動量"}を武器に、直面した壁を乗り越えて成果を出した経験。`;

      setResult(generated);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-8 my-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2 text-indigo-600">
          <Sparkles className="w-6 h-6" /> エピソード発掘・自己分析アシスタント
        </h1>
        <p className="text-gray-500 text-sm">
          3つの質問に答えるだけで、ESで使える「長所・短所・ガクチカの骨組み」を引き出します。
        </p>
      </div>

      <div className="space-y-3">
        <label className="font-semibold text-gray-700 block">1. グループやチームでの自分の立ち回りは？</label>
        <div className="grid grid-cols-1 gap-2">
          {options.role.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAnswers({ ...answers, role: opt.id })}
              className={`p-3 text-left rounded-lg border transition ${
                answers.role === opt.id
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-medium"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="font-semibold text-gray-700 block">2. トラブルや困難に直面したときのアプローチは？</label>
        <div className="grid grid-cols-1 gap-2">
          {options.approach.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAnswers({ ...answers, approach: opt.id })}
              className={`p-3 text-left rounded-lg border transition ${
                answers.approach === opt.id
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-medium"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="font-semibold text-gray-700 block">3. これまでの学生生活で一番力を入れたことは？</label>
        <div className="grid grid-cols-1 gap-2">
          {options.source.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAnswers({ ...answers, source: opt.id })}
              className={`p-3 text-left rounded-lg border transition ${
                answers.source === opt.id
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-medium"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" /> 分析中...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" /> エピソード・長所を生成する
          </>
        )}
      </button>

      {result && (
        <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 space-y-4">
          <h3 className="font-bold text-lg text-indigo-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" /> あなたの分析結果・ESのヒント
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-bold text-indigo-600 block mb-1">【長所】</span>
              {result.strength}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-bold text-indigo-600 block mb-1">【短所（言い換え表現）】</span>
              {result.weakness}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-bold text-indigo-600 block mb-1">【ガクチカ（学生時代に力を入れたこと）の骨組み】</span>
              {result.gakuchika}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}