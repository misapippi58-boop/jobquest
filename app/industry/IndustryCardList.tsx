"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import CompanyCard from "../CompanyCard";
import { Company } from "../types/company";
import { Check } from "lucide-react";

type Props = {
  cards: Company[];
  sortMode: boolean;
  deleteMode: boolean;
  selectedDelete: string[];
  onToggleSelect: (id: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onOpenDetail: (card: Company) => void;
};

export default function IndustryCardList({ 
  cards, 
  sortMode, 
  deleteMode, 
  selectedDelete, 
  onToggleSelect, 
  onDragEnd, 
  onOpenDetail 
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4">
          {cards.map((card) => {
            const isSelected = selectedDelete.includes(card.id);

            return (
              <div key={card.id} className="relative">
                <div
                  onClick={() => {
                    if (deleteMode) {
                      onToggleSelect(card.id);
                    } else {
                      onOpenDetail(card);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {/* 💡 ぼやけ（backdrop-blur）を完全になくし、選択された時だけピンクの枠線と背景色で分かりやすくしました */}
                  <div className={`transition-all rounded-3xl ${isSelected ? "ring-2 ring-red-400 bg-red-50/30" : ""}`}>
                    <CompanyCard
                      company={card}
                      onOpen={() => {
                        if (!deleteMode) onOpenDetail(card);
                      }}
                      onEdit={() => {}}
                      dragEnabled={sortMode && !deleteMode}
                      showDetails={false}
                      showEditButton={false}
                    />
                  </div>

                  {/* 削除モード時のチェックマーク（カードの右端に綺麗に配置） */}
                  {deleteMode && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm ${
                        isSelected 
                          ? "bg-red-500 border-red-500 text-white" 
                          : "bg-white border-gray-300 text-transparent"
                      }`}>
                        <Check size={16} className="stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}