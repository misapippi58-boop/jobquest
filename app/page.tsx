"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import CompanyCard from "./CompanyCard";
import CompanyModal from "./CompanyModal";
import CompanyDetail from "./CompanyDetail";
import SelfAnalysis from "./SelfAnalysis";
import AuthModal from "./settings/components/AuthModal";
import { EMPTY_COMPANY } from "./companyDefaults";
import { sortCompanies } from "./lib/sortCompanies";
import { getNextSchedule } from "./lib/getNextSchedule";
import type { Company } from "./types/company";
import { Button, BottomNav, DashboardStats, ActionMenu } from "./ui";
import { db, auth } from "./src/firebaseConfig";

export default function Page() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState("manual");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [draft, setDraft] = useState<Company>({ ...EMPTY_COMPANY });
  const [activeTab, setActiveTab] = useState<"companies" | "analysis">("companies");

  // 認証用ステート
  const [topAuthMode, setTopAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // 💡 連打防止用ステート

  // 1. 【初期化】ログイン状態の監視 ＆ データの初期読み込み
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompanies(docSnap.data().companies || []);
        }
      } else {
        setCompanies([]);
      }
      setIsReady(true);
    });

    return () => unsubscribe();
  }, []);

  // 2. 【自動保存】データが変わったら Firestore に保存
  useEffect(() => {
    if (!isReady || !user) return;

    const saveToFirestore = async () => {
      await setDoc(doc(db, "users", user.uid), { companies }, { merge: true });
    };
    saveToFirestore();
  }, [companies, user, isReady]);

  // Googleログイン/登録処理（連打・キャンセルエラー対策済み）
  const handleGoogleAuth = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setErrorMessage("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
        console.log("ログインポップアップが閉じられました");
        return;
      }
      console.error("Google認証失敗:", error);
      setErrorMessage(`Google連携に失敗しました: ${error.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // メールアドレスでのログイン・新規登録処理
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (topAuthMode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("アカウントを作成しました！");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("ログインしました！");
      }
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("認証エラー:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("このメールアドレスはすでに使われています。");
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage("メールアドレスまたはパスワードが間違っています。");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("パスワードは6文字以上で入力してください。");
      } else {
        setErrorMessage("認証に失敗しました。入力内容を確認してください。");
      }
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = companies.findIndex((c) => c.id === active.id);
    const newIndex = companies.findIndex((c) => c.id === over.id);
    setCompanies((items) => arrayMove(items, oldIndex, newIndex));
  }

  const displayCompanies = sortCompanies(companies, sortMode);
  const nextSchedule = getNextSchedule(companies);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-gray-500 font-bold">読み込み中...</p>
      </div>
    );
  }

  // 💡 未ログイン時の画面
  if (!user) {
    return (
      <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-pink-100 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500">
              JobQuest
            </h1>
            <p className="text-xs text-gray-500">
              就職活動の管理をもっとスマートに
            </p>
          </div>

          {/* タブ切り替え */}
          <div className="flex bg-pink-50 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => { setTopAuthMode("login"); setErrorMessage(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                topAuthMode === "login" 
                  ? "bg-white text-pink-600 shadow-xs" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={() => { setTopAuthMode("signup"); setErrorMessage(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                topAuthMode === "signup" 
                  ? "bg-white text-pink-600 shadow-xs" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              新規登録
            </button>
          </div>

          {/* エラーメッセージ表示 */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium text-center">
              {errorMessage}
            </div>
          )}

          {/* メールアドレス入力フォーム */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 px-1">メールアドレス</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 bg-pink-50/50 border border-pink-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 px-1">パスワード（6文字以上）</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-pink-50/50 border border-pink-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            {/* 修正：カスタムButtonから通常のbuttonに変更 */}
            <button
              type="submit"
              className="w-full py-3.5 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-bold shadow-md shadow-pink-200 transition text-xs"
            >
              {topAuthMode === "login" ? "メールアドレスでログイン" : "アカウントを作成する"}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-300 text-[11px]">または</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Googleログイン / 登録ボタン */}
          <Button
            type="button"
            onClick={handleGoogleAuth}
            variant="white"
            disabled={isLoggingIn}
            className="w-full py-3.5 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2 text-xs shadow-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            {isLoggingIn ? "接続中..." : `Googleで${topAuthMode === "login" ? "ログイン" : "新規登録"}`}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-pink-50 p-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500">
                JobQuest
              </h1>
            </div>
            {activeTab === "companies" && (
              <ActionMenu onSortChange={setSortMode} onAddNew={openNew} />
            )}
          </div>

          {activeTab === "analysis" ? (
            <SelfAnalysis />
          ) : (
            <>
              <div className="mb-6">
                <DashboardStats totalCompanies={companies.length} nextSchedule={nextSchedule} mounted={isReady} />
              </div>

              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={companies} strategy={verticalListSortingStrategy}>
                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {displayCompanies.map((company) => (
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

      <BottomNav />

      {selectedCompany && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] overflow-y-auto flex justify-center items-start p-4"
          onClick={() => setSelectedCompany(null)}
        >
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