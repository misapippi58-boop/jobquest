"use client";

type Props = {
  open: boolean;
  mode: "new" | "edit";
  draft: any;
  setDraft: any;
  onSave: () => void;
  onClose: () => void;
  onDelete: () => void;
};

import {Button,} from "./ui";

import { Trash2 } from "lucide-react";

import CompanyForm from "./CompanyForm";

export default function CompanyModal({
  open,
  mode,
  draft,
  setDraft,
  onSave,
  onClose,
  onDelete,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
      fixed 
      inset-0 
      bg-black/40 
      flex 
      items-center 
      justify-center 
      p-4 
      z-[100]"
      onClick={onClose}
    >

      <div
        className="bg-white w-full max-w-xl rounded-3xl p-6 space-y-3 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="text-2xl font-extrabold text-gray-dark-500">
          {mode === "new" ? "企業追加" : "企業詳細"}
        </h2>

        <CompanyForm
          draft={draft}
          setDraft={setDraft}
        />

        {/* ボタン */}
        <div className="flex gap-2 pt-4">

          <Button onClick={onSave}>
            保存
          </Button>

          <Button
            variant="white"
            onClick={onClose}
          >
            閉じる
          </Button>

        {mode === "edit" && (
         <Button
            variant="icon"
            onClick={() => {
              if (!confirm("削除しますか？")) {
                return;
              }

              onDelete();
            }}
          >
            <Trash2
              size={18}
              className="text-red-500"
            />
          </Button>
        )}


        </div>
      </div>
    </div>
  );
}