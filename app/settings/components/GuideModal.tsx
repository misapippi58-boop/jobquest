"use client";

import { X, BookOpen, Building2, Compass, Sparkles, Search } from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-base text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-600" /> 使い方ガイド
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-gray-600">
          <div className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-pink-600 shrink-0" />
            <div>
              <p className="font-bold text-gray-800">企業管理</p>
              <p className="text-[11px] text-gray-500">気になった企業を登録・管理できます。</p>
            </div>
          </div>

          <div className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-pink-600 shrink-0" />
            <div>
              <p className="font-bold text-gray-800">企業検索</p>
              <p className="text-[11px] text-gray-500">登録した企業の中からスムーズに探し出せます。</p>
            </div>
          </div>

          <div className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
            <Compass className="w-5 h-5 text-pink-600 shrink-0" />
            <div>
              <p className="font-bold text-gray-800">業界研究</p>
              <p className="text-[11px] text-gray-500">気になる業界の情報をまとめてリサーチできます。</p>
            </div>
          </div>

          <div className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-pink-600 shrink-0" />
            <div>
              <p className="font-bold text-gray-800">16タイプ診断</p>
              <p className="text-[11px] text-gray-500">自己分析を通して、自分の向き不向きを診断できます。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}