"use client";
export const dynamic = 'force-dynamic';


import { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import CompanyCard from "./CompanyCard";
import CompanyModal from "./CompanyModal";
import CompanyDetail from "./CompanyDetail";
import SelfAnalysis from "./SelfAnalysis"; // 💡 追加：自己分析コンポーネント
import { EMPTY_COMPANY } from "./companyDefaults";
import { sortCompanies } from "./lib/sortCompanies";
import { getNextSchedule } from "./lib/getNextSchedule";
import type { Company } from "./types/company";
import { Button, BottomNav, DashboardStats, ActionMenu } from "./ui";
import { db, auth } from "./src/firebaseConfig";

export default function Page() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false); // mounted と loaded を統合

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState("manual");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [draft, setDraft] = useState<Company>({ ...EMPTY_COMPANY });

  // 💡 追加：画面の切り替え用ステート ("companies" がホーム・企業一覧、"analysis" が自己分析)
  const [activeTab, setActiveTab] = useState<"companies" | "analysis">("companies");

  // 1. 【初期化】ログイン状態の監視 ＆ データの初期読み込み
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // ログイン済：Firestore から取得
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompanies(docSnap.data().companies || []);
        }
      } else {
        // 未ログイン：localStorage から取得
        const saved = localStorage.getItem("companies");
        if (saved) {
          setCompanies(JSON.parse(saved));
        }
      }
      setIsReady(true); // 読み込み完了（ハイドレーション対策も兼ねる）
    });

    return () => unsubscribe();
  }, []);

  // 2. 【自動保存】データが変わったら適切な場所に保存
  useEffect(() => {
    if (!isReady) return; // 初期ロードが終わる前は空配列で上書きしないようブロック

    if (user) {
      // ログイン済：Firestore に保存
      const saveToFirestore = async () => {
        await setDoc(doc(db, "users", user.uid), { companies }, { merge: true });
      };
      saveToFirestore();
    } else {
      // 未ログイン：localStorage に保存
      localStorage.setItem("companies", JSON.stringify(companies));
    }
  }, [companies, user, isReady]);

  // Googleログイン処理
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      alert(`${result.user.displayName} さん、こんにちは！`);
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  // 操作系ロジック
  const openNew = () => {
    setMode("new");
    setActiveId(null);
    setDraft({ ...EMPTY_COMPANY });
    setOpen(true);
  };

  const openEdit = (c: Company) => {
    setMode("edit");
    setActiveId(c.id);
    setDraft(c);
    setOpen(true);
  };

  const save = () => {
    if (!draft.name.trim()) {
      alert("企業名を入れて");
      return;
    }

    if (mode === "new") {
      setCompanies((prev) => [...prev, { ...draft, id: crypto.randomUUID() }]);
    } else {
      setCompanies((prev) => prev.map((c) => (c.id === activeId ? draft : c)));
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  // ドラッグ＆ドロップ処理
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = companies.findIndex((c) => c.id === active.id);
    const newIndex = companies.findIndex((c) => c.id === over.id);
    setCompanies((items) => arrayMove(items, oldIndex, newIndex));
  }

  const displayCompanies = sortCompanies(companies, sortMode);
  const nextSchedule = getNextSchedule(companies);

  return (
    <>
      <main className="min-h-screen bg-pink-50 p-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダーエリア */}
          <div className="flex justify-between items-center mb-6">
            <div>
              {user ? (
                <h1 className="text-xl font-black text-gray-700">{user.displayName} さん</h1>
              ) : (
                <h1
                  onClick={handleLogin}
                  className="cursor-pointer text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500"
                >
                  JobQuest
                </h1>
              )}
            </div>
            {/* ホーム画面のときだけアクションメニューを表示 */}
            {activeTab === "companies" && <ActionMenu onSortChange={setSortMode} onAddNew={openNew} />}
          </div>

          {/* 💡 タブの切り替え表示（自己分析 or 従来の企業一覧） */}
          {activeTab === "analysis" ? (
            <SelfAnalysis />
          ) : (
            <>
              <div className="mb-6">
                <DashboardStats totalCompanies={companies.length} nextSchedule={nextSchedule} mounted={isReady} />
              </div>

              {/* カード一覧 */}
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={companies} strategy={verticalListSortingStrategy}>
                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {isReady &&
                      displayCompanies.map((company) => (
                        <CompanyCard
                          key={company.id}
                          company={company}
                          onOpen={() => setSelectedCompany(company)}
                          onEdit={() => openEdit(company)}
                          dragEnabled={sortMode === "manual"}
                        />
                      ))}
                  </section>
                </SortableContext>
              </DndContext>
            </>
          )}

          {/* モーダル */}
          <CompanyModal
            open={open}
            mode={mode}
            draft={draft}
            setDraft={setDraft}
            onSave={save}
            onClose={() => setOpen(false)}
            onDelete={() => {
              if (activeId) remove(activeId);
              setOpen(false);
            }}
          />
        </div>
      </main>

      {/* 💡 元々用意されていた BottomNav コンポーネントを使用しつつ、タブ切り替えを連携 */}
      <BottomNav />

      {/* 詳細モーダル */}
      {selectedCompany && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] overflow-y-auto flex justify-center items-start p-4"
          onClick={() => setSelectedCompany(null)}
        >
          {/* 背景クリックで閉じるとき、中身のクリックが伝播しないよう対策 */}
          <div onClick={(e) => e.stopPropagation()}>
            <CompanyDetail
              company={selectedCompany}
              onBack={() => setSelectedCompany(null)}
              onEdit={() => {
                setSelectedCompany(null);
                setDraft(selectedCompany);
                setActiveId(selectedCompany.id);
                setMode("edit");
                setOpen(true);
              }}
              onDelete={() => {
                remove(selectedCompany.id);
                setSelectedCompany(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}