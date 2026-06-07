"use client";

import CompanyCard from "./CompanyCard";
import CompanyModal from "./CompanyModal";
import CompanyDetail from "./CompanyDetail";
import { EMPTY_COMPANY } from "./companyDefaults";
import { sortCompanies } from "./lib/sortCompanies";
import { getNextSchedule }from "./lib/getNextSchedule";
import { useEffect, useState } from "react";
import type { Company, ScheduleItem } from "./types/company";

import {
  DndContext,
  closestCenter,
  DragEndEvent
} from "@dnd-kit/core";

import {
  Button,
  BottomNav,
  DashboardStats,
  ActionMenu
} from "./ui";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { db } from "./src/firebaseConfig";
import { auth } from "./src/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();

const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("ログイン成功:", user.displayName);
    alert(`${user.displayName} さん、こんにちは！`);
  } catch (error) {
    console.error("ログイン失敗:", error);
  }
};

export default function Page() {
  const [companies, setCompanies] =
    useState<Company[]>([]);
  const [loaded, setLoaded] = useState(false);

  // localStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("companies");

    if (saved) {
      setCompanies(JSON.parse(saved));
    }

    setLoaded(true);
  }, []);

  // 読み込み完了後だけ保存
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "companies",
      JSON.stringify(companies)
    );
  }, [companies, loaded]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [user, setUser] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [sortMode, setSortMode] = useState("manual");
  const [selectedCompany, setSelectedCompany] =
    useState<Company | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

// 1. ユーザーがログインしたら Firestore からデータを読み込む
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // ログインしたら Firestore からデータを取得
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompanies(docSnap.data().companies || []);
        }
      } else {
        // ログアウトしたらローカルのデータに戻す（必要に応じて）
        setCompanies([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const [draft, setDraft] = useState<Company>({
    ...EMPTY_COMPANY,
  });

// 2. companies が更新されたら Firestore に自動保存する
  useEffect(() => {
    if (user) {
      const saveToFirestore = async () => {
        await setDoc(doc(db, "users", user.uid), { companies }, { merge: true });
      };
      saveToFirestore();
    }
  }, [companies, user]);

  // 新規
  const openNew = () => {
    setMode("new");
    setActiveId(null);
    setDraft({
      ...EMPTY_COMPANY,
    });
    setOpen(true);
  };

  // 編集
  const openEdit = (c: Company) => {
    setMode("edit");
    setActiveId(c.id);
    setDraft(c);
    setOpen(true);
  };

  // 保存
  const save = () => {
    if (!draft.name.trim()) {
      alert("企業名入れて");
      return;
    }

    if (mode === "new") {
      setCompanies((prev) => [
        ...prev,
        {
          ...draft,
          id: crypto.randomUUID(),
        },
      ]);
    } else {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === activeId ? draft : c
        )
      );
    }

    setOpen(false);
  };

  // 削除
  const remove = (id: string) => {
    setCompanies((prev) =>
      prev.filter((c) => c.id !== id)
    );
  };

  // ドラッグ
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = companies.findIndex(
      (c) => c.id === active.id
    );

    const newIndex = companies.findIndex(
      (c) => c.id === over.id
    );

    setCompanies((items) =>
      arrayMove(items, oldIndex, newIndex)
    );
  }

const displayCompanies =
  sortCompanies(companies, sortMode);

const nextSchedule =
  getNextSchedule(companies);

  return (
    <>
<main className="min-h-screen bg-pink-50 p-6 pb-32">
  <div className="max-w-7xl mx-auto">

    {/* ヘッダー */}
    <div className="mb-4">
      {user ? (
        <h1 className="text-xl font-black text-gray-700">
          {user.displayName} さん
        </h1>
      ) : (
        <h1
          onClick={handleLogin}
          className="
          cursor-pointer 
          text-xl 
          font-black 
          tracking-tight 
          text-transparent 
          bg-clip-text 
          bg-gradient-to-r 
          from-blue-500 
          via-fuchsia-500 
          to-pink-500"
        >
          JobQuest (ログイン)
        </h1>
      )}
    </div>

  {/* 情報カード + 操作 */}
  <div className="flex justify-between items-start mb-6">

  <DashboardStats 
      totalCompanies={companies.length}
      nextSchedule={nextSchedule}
      mounted={mounted}
    />

    <ActionMenu 
      onSortChange={setSortMode} 
      onAddNew={openNew} 
    />

  </div>

      {/* カード一覧 */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={companies}
          strategy={verticalListSortingStrategy}
        >

          <section
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-4
            "
          >

          {mounted &&
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

      {/* モーダル */}
      <CompanyModal
        open={open}
        mode={mode}
        draft={draft}
        setDraft={setDraft}
        onSave={save}
        onClose={() => setOpen(false)}
        onDelete={() => { 
          if (activeId) { 
            remove(activeId); 
          } 
          
          setOpen(false); 
        }}
      />
            </div>
          </main>

          {selectedCompany && (
            <div
              className="
                fixed
                inset-0
                bg-black/40
                z-50
                overflow-y-auto
                flex
                justify-center
                items-start
                p-4
              "
              onClick={() => setSelectedCompany(null)}
            >
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
          )}
        </>
      );}