"use client";

import { X, Shield } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-base text-gray-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-pink-600" /> 利用規約
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-[11px] text-gray-600 leading-relaxed">
          <div>
            <h4 className="font-bold text-gray-800 mb-1">第1条（適用）</h4>
            <p>本規約は、本アプリ（JobQuest）の利用に関する一切の条件に適用されます。</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-1">第2条（禁止事項）</h4>
            <p>ユーザーは、本アプリの利用にあたり、法令や公序良俗に違反する行為、または運営を妨害する行為を行ってはならないものとします。</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-1">第3条（免責事項）</h4>
            <p>本アプリの提供する情報や機能について、正確性や安全性を完全に保証するものではありません。利用によって生じた損害について、開発者は一切の責任を負いません。</p>
          </div>
        </div>
      </div>
    </div>
  );
}