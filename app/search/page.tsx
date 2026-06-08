"use client";

import { useEffect, useState } from "react";
import { House, Search } from "lucide-react";
import { FilterChip } from "../ui";
import { useRouter } from "next/navigation";
import CompanyDetail from "../CompanyDetail";

export default function SearchPage() {
  const [search, setSearch] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("");

  const [progressFilter, setProgressFilter] = useState("");

  const router = useRouter();

  const [selectedCompany, setSelectedCompany] =
  useState<any>(null);

  const [companies, setCompanies] = useState<any[]>([]); 
  useEffect(() => {
   const saved = localStorage.getItem("companies");

   if (saved) { setCompanies(JSON.parse(saved)); 

   } 
  }, []);

  // 全項目検索
  const filtered = companies.filter((c) => {

  const textMatch =
    JSON.stringify(c)
      .toLowerCase()
      .includes(search.toLowerCase());

  const priorityMatch =
    priorityFilter === "" ||
    c.priority === priorityFilter;

  const progressMatch =
    progressFilter === ""
      ? true
      : progressFilter === "面接"
      ? c.progress.includes("面接")
      : c.progress === progressFilter;

  return (
    textMatch &&
    priorityMatch &&
    progressMatch
  );
});

  return (
    <main className="min-h-screen bg-pink-50 p-6 pb-24">

      {/* 検索バー */}
      <input
        className="
          w-full
          rounded-2xl
          border
          border-pink-200
          bg-white
          px-4
          py-3
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-pink-300
        "
        placeholder="企業名・勤務地・メモなど検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex gap-2 mt-4 flex-wrap">

        <FilterChip
          variant="white"
          active={priorityFilter === ""}
          onClick={() => setPriorityFilter("")}
        >
          全て
        </FilterChip>

        <FilterChip
          variant="pink"
          active={priorityFilter === "第1志望"}
          onClick={() => setPriorityFilter("第1志望")}
        >
          第1志望
        </FilterChip>

        <FilterChip
          variant="pink"
          active={priorityFilter === "第2志望"}
          onClick={() => setPriorityFilter("第2志望")}
        >
          第2志望
        </FilterChip>

        <FilterChip
          variant="pink"
          active={priorityFilter === "第3志望"}
          onClick={() => setPriorityFilter("第3志望")}
        >
          第3志望
        </FilterChip>

      </div>

      {/* 結果 */}
      <div className="mt-6 space-y-4">

        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCompany(c)}
            className="
              rounded-3xl
              bg-white
              p-4
              shadow-sm
              border
              border-pink-100
              cursor-pointer
            "
          >
            <h2 className="text-xl font-bold text-gray-800">
              {c.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              本社：
              {[
                c.prefecture,
                c.city,
                c.address,
              ]
                .filter(Boolean)
                .join("")}
            </p>

            <p className="text-sm text-gray-500">
              勤務地：{c.workLocation}
            </p>

            <p className="text-sm text-gray-600 mt-2">
              {c.memo}
            </p>
          </div>
        ))}

      </div>

      {/* 下タブ */}
      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          bg-white/90
          backdrop-blur
          border-t
          border-pink-100
          flex
          justify-around
          py-3
        "
      >
        <a href="/">
          <House />
        </a>

        <a href="/search">
          <Search />
        </a>
      </nav>

      {selectedCompany && (
  <CompanyDetail
    company={selectedCompany}
    onBack={() => setSelectedCompany(null)}
    onEdit={() => {}}
    onDelete={() => {}}
  />
)}

    </main>

  );
}
