"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Target, X, Briefcase } from "lucide-react";
import CompanyDetail from "../CompanyDetail";

const REGION_MAP: { [key: string]: string[] } = {
  "北海道・東北": ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  "関東": ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  "中部": ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
  "関西": ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  "中国・四国": ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"],
  "九州・沖縄": ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]
};

const PRIORITIES = ["第1志望", "第2志望", "第3志望"];

export default function SearchPage() {
  const [search, setSearch] = useState("");
  
  // フィルター状態
  const [activePriority, setActivePriority] = useState<string[]>([]);
  const [activePrefectures, setActivePrefectures] = useState<string[]>([]); // 所在地用
  const [activeWorkLocs, setActiveWorkLocs] = useState<string[]>([]); // 勤務地用

  // モーダル用の一時状態
  const [tempPriority, setTempPriority] = useState<string[]>([]);
  const [tempPrefectures, setTempPrefectures] = useState<string[]>([]);
  const [tempWorkLocs, setTempWorkLocs] = useState<string[]>([]);

  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isWorkLocationModalOpen, setIsWorkLocationModalOpen] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]); 

  useEffect(() => {
    const saved = localStorage.getItem("companies");
    if (saved) { setCompanies(JSON.parse(saved)); } 
  }, []);

  // 検索・フィルタリング処理
  const filtered = companies.filter((c) => {
    const textMatch = JSON.stringify(c).toLowerCase().includes(search.toLowerCase());
    const priorityMatch = activePriority.length === 0 || activePriority.includes(c.priority);
    const locationMatch = activePrefectures.length === 0 || activePrefectures.includes(c.prefecture);
    const workLocationMatch = activeWorkLocs.length === 0 || activeWorkLocs.includes(c.workLocation);

    return textMatch && priorityMatch && locationMatch && workLocationMatch;
  });

  // 汎用トグル
  const toggleItem = (item: string, list: string[], setList: Function) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  // 地方全選択・解除トグル
  const toggleRegion = (prefs: string[], list: string[], setList: Function) => {
    const allSelected = prefs.every(p => list.includes(p));
    if (allSelected) {
      setList(list.filter(p => !prefs.includes(p))); // 全部外す
    } else {
      setList([...new Set([...list, ...prefs])]); // 全部足す
    }
  };

  return (
    <main className="h-screen overflow-y-auto bg-pink-50 p-6 pb-32">
      <input
        className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        placeholder="企業名・勤務地・メモなど検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <div className="flex gap-2 mt-4">
        <button onClick={() => { setTempPrefectures(activePrefectures); setIsRegionModalOpen(true); }} 
                className={`flex-1 flex justify-center items-center gap-1.5 py-3 rounded-2xl border text-[11px] font-bold shadow-sm ${activePrefectures.length ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-700 border-pink-200"}`}>
          <MapPin className="w-3.5 h-3.5" /> 所在地
        </button>
        <button onClick={() => { setTempWorkLocs(activeWorkLocs); setIsWorkLocationModalOpen(true); }} 
                className={`flex-1 flex justify-center items-center gap-1.5 py-3 rounded-2xl border text-[11px] font-bold shadow-sm ${activeWorkLocs.length ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-700 border-pink-200"}`}>
          <Briefcase className="w-3.5 h-3.5" /> 勤務地
        </button>
        <button onClick={() => { setTempPriority(activePriority); setIsPriorityModalOpen(true); }} 
                className={`flex-1 flex justify-center items-center gap-1.5 py-3 rounded-2xl border text-[11px] font-bold shadow-sm ${activePriority.length ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-700 border-pink-200"}`}>
          <Target className="w-3.5 h-3.5" /> 志望度
        </button>
      </div>

      {/* 所在地モーダル */}
      {isRegionModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center p-4" onClick={() => setIsRegionModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="font-black text-lg">所在地で絞り込み</h3>
            {Object.entries(REGION_MAP).map(([region, prefs]) => (
              <div key={region} className="space-y-2">
                <button onClick={() => toggleRegion(prefs, tempPrefectures, setTempPrefectures)} 
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl ${prefs.every(p => tempPrefectures.includes(p)) ? "bg-pink-600 text-white" : "bg-pink-50 text-pink-800"}`}>
                  {region} 全体
                </button>
                <div className="flex flex-wrap gap-1.5 pl-1">
                  {prefs.map(p => (
                    <button key={p} onClick={() => toggleItem(p, tempPrefectures, setTempPrefectures)} className={`text-xs px-2.5 py-1 rounded-xl ${tempPrefectures.includes(p) ? "bg-pink-600 text-white" : "bg-white text-gray-700 border border-pink-200"}`}>{p}</button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => { setActivePrefectures(tempPrefectures); setIsRegionModalOpen(false); }} className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl mt-4">決定</button>
          </div>
        </div>
      )}

      {/* 勤務地モーダル */}
      {isWorkLocationModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center p-4" onClick={() => setIsWorkLocationModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="font-black text-lg">勤務地で絞り込み</h3>
            {Object.entries(REGION_MAP).map(([region, prefs]) => (
              <div key={region} className="space-y-2">
                <button onClick={() => toggleRegion(prefs, tempWorkLocs, setTempWorkLocs)} 
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl ${prefs.every(p => tempWorkLocs.includes(p)) ? "bg-pink-600 text-white" : "bg-pink-50 text-pink-800"}`}>
                  {region} 全体
                </button>
                <div className="flex flex-wrap gap-1.5 pl-1">
                  {prefs.map(p => (
                    <button key={p} onClick={() => toggleItem(p, tempWorkLocs, setTempWorkLocs)} className={`text-xs px-2.5 py-1 rounded-xl ${tempWorkLocs.includes(p) ? "bg-pink-600 text-white" : "bg-white text-gray-700 border border-pink-200"}`}>{p}</button>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => { setActiveWorkLocs(tempWorkLocs); setIsWorkLocationModalOpen(false); }} className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl mt-4">決定</button>
          </div>
        </div>
      )}

      {/* 志望度モーダル・結果一覧部分は省略 */}
      {isPriorityModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center p-4" onClick={() => setIsPriorityModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="font-black text-lg mb-2">志望度を選択</h3>
            {PRIORITIES.map((p) => (
              <button key={p} onClick={() => toggleItem(p, tempPriority, setTempPriority)} className={`w-full text-sm font-bold py-3 rounded-2xl ${tempPriority.includes(p) ? "bg-pink-600 text-white" : "bg-gray-50 text-gray-700"}`}>{p}</button>
            ))}
            <button onClick={() => { setActivePriority(tempPriority); setIsPriorityModalOpen(false); }} className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl mt-4">決定</button>
          </div>
        </div>
      )}
      
      {/* 結果一覧 */}
      <div className="mt-6 space-y-4">
        {filtered.map((c) => (
          <div key={c.id} onClick={() => setSelectedCompany(c)} className="rounded-3xl bg-white p-4 shadow-sm border border-pink-100 cursor-pointer">
            <h2 className="text-xl font-bold text-gray-800">{c.name}</h2>
            <p className="text-sm text-gray-500 mt-1">本社：{c.prefecture}{c.city}{c.address}</p>
            <p className="text-sm text-pink-600 mt-1 font-bold">勤務地：{c.workLocation}</p>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center p-4" onClick={() => setSelectedCompany(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <CompanyDetail company={selectedCompany} onBack={() => setSelectedCompany(null)} onEdit={() => {}} onDelete={() => {}} />
          </div>
        </div>
      )}
    </main>
  );
}