"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Button from "../ui/Button";
import { INDUSTRY_DB } from "../data/industryData";

type Props = {
  jobName: string | null;
  onClose: () => void;
  onDelete: (jobName: string) => void;
  onSaveNote: (jobName: string, note: string) => void;
  initialNote: string;
};

export default function IndustryDetailModal({ jobName, onClose, onDelete, onSaveNote, initialNote }: Props) {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  if (!jobName) return null;

  // あらゆる階層・構造から jobName に一致するデータを安全に探索
  let foundJob: any = null;
  for (const industry of Object.values(INDUSTRY_DB) as any[]) {
    if (industry.specializedJobs && industry.specializedJobs[jobName]) {
      foundJob = industry.specializedJobs[jobName];
      break;
    }
    if (industry.jobs && industry.jobs[jobName]) {
      foundJob = industry.jobs[jobName];
      break;
    }
    if (industry.jobs) {
      for (const job of Object.values(industry.jobs) as any[]) {
        if (job.routes && job.routes[jobName]) {
          foundJob = job.routes[jobName];
          break;
        }
      }
      if (foundJob) break;
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto [-webkit-overflow-scrolling:touch]">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="flex min-h-[calc(100vh+1px)] items-start justify-center p-4 pb-32">
        <div 
          className="relative bg-white w-full max-w-lg rounded-3xl p-8 mt-8 shadow-xl z-10" 
          onClick={(e) => e.stopPropagation()}
        >
          {!foundJob ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-gray-800 font-bold">データが見つかりません</p>
              <p className="text-xs text-gray-500">
                「{jobName}」の詳細データがマスターに見つかりませんでした。
              </p>
              <div className="flex justify-center">
                <Button onClick={onClose} variant="white">
                  閉じる
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 relative">
              <button
                onClick={() => onDelete(jobName)}
                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>

              <h2 className="text-2xl font-bold text-pink-600 pr-8">
                {jobName}
              </h2>

              {/* 詳しい仕事内容 */}
              {foundJob.description && (
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">仕事内容</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{foundJob.description}</p>
                </div>
              )}

              {/* 年収目安 */}
              {foundJob.salary && (
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">年収目安</p>
                  <p className="text-pink-600 font-bold">{foundJob.salary}</p>
                </div>
              )}

              {/* 将来性とキャリアパス */}
              {foundJob.future && (
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">将来性とキャリアパス</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                    {foundJob.future}
                  </p>
                </div>
              )}

              {/* 転勤・勤務地特性 */}
              {foundJob.relocation && (
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">転勤・勤務環境</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                    {foundJob.relocation}
                  </p>
                </div>
              )}

              {/* メモ */}
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1">自分で調べたこと・メモ</p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-pink-50 border border-pink-100 min-h-[140px] resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm text-gray-800"
                  placeholder="面接の感想やOB訪問で聞いた話などを入力..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => onSaveNote(jobName, note)}
                  className="flex-1"
                  variant="pink"
                >
                  保存する
                </Button>

                <Button onClick={onClose} className="flex-1" variant="white">
                  閉じる
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}