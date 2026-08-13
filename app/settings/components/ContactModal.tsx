"use client";

import { useState } from "react";
import { X, CheckCircle2, ChevronDown } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  contactMessage: string;
  setContactMessage: (val: string) => void;
  isSubmitting: boolean;
  contactSuccess: boolean;
  handleSendContact: (e: React.FormEvent) => void;
}

export default function ContactModal({
  isOpen, onClose, contactEmail, setContactEmail,
  contactMessage, setContactMessage, isSubmitting, contactSuccess, handleSendContact
}: ContactModalProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const faqList = [
    {
      q: "データは自動で保存されますか？",
      a: "ログインしている状態で企業を追加・編集すると、クラウドデータベース（Firebase）に安全に保存されます。端末を変えても同じアカウントでログインすればデータを引き継げます。"
    },
    {
      q: "パスワードを忘れてしまった場合は？",
      a: "現在パスワード再発行機能は準備中です。ログイン画面のメールアドレス認証でお困りの場合は、お問い合わせフォームよりご連絡ください。"
    },
    {
      q: "16タイプ診断やES自動生成は無料で使えますか？",
      a: "はい、すべての機能を基本無料でご利用いただけます！薬学生や就活生の皆さんの自己分析にお役立てください。"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl space-y-6 max-h-[85vh] overflow-y-auto">
        
        <div className="flex justify-between items-center">
          <h3 className="font-black text-base text-gray-800">お問い合わせ ＆ よくあるご質問</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {contactSuccess ? (
          <div className="py-10 text-center space-y-3 bg-pink-50/50 rounded-2xl border border-pink-100">
            <CheckCircle2 className="w-12 h-12 text-pink-600 mx-auto animate-bounce" />
            <h4 className="text-sm font-black text-gray-800">お問い合わせを受け付けました！</h4>
            <p className="text-xs text-gray-500 px-4 leading-relaxed">
              ご入力いただいたメールアドレス宛に控えを保存いたしました。内容を確認次第、運営よりご連絡いたします。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendContact} className="space-y-3 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
            <h4 className="text-xs font-bold text-pink-700">✉️ メッセージを送る</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              不具合やご要望がございましたら、以下から送信してください。
            </p>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500">ご入力メールアドレス</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500">お問い合わせ内容</label>
              <textarea
                required
                rows={3}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="ここに内容を入力してください..."
                className="w-full p-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-2xl transition shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </button>
          </form>
        )}

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-700 px-1">❓ よくあるご質問 (FAQ)</h4>
          <div className="space-y-2">
            {faqList.map((faq, index) => (
              <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-3 text-left font-bold text-xs text-gray-800 flex justify-between items-center hover:bg-pink-50/30 transition"
                >
                  <span>Q. {faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaqIndex === index ? "rotate-180" : ""}`} />
                </button>
                {openFaqIndex === index && (
                  <div className="p-3 pt-0 text-[11px] text-gray-600 leading-relaxed bg-pink-50/20 border-t border-gray-50">
                    A. {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}