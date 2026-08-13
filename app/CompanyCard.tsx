import { useState, useEffect, useRef } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { MoreVertical, GripVertical } from "lucide-react";
import type { Company } from "./types/company";

type Props = { 
  onOpen: () => void;
  onEdit: () => void;
  company: Company;
  showBadge?: boolean;
  dragEnabled: boolean;
  showDetails?: boolean;
  showEditButton?: boolean;
};

const Badge = ({ children, colorClass }: { children: React.ReactNode; colorClass: string }) => (
  <div className={`rounded-full px-3 py-1 text-xs font-bold text-white shadow ${colorClass}`}>
    {children}
  </div>
);

export default function CompanyCard({
  onOpen, 
  onEdit, 
  company,
  dragEnabled, 
  showDetails = true,
  showEditButton = true
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: company.id,
    disabled: !dragEnabled,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  // メニューの外側をクリックしたときに閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div ref={setNodeRef} 
         style={style} 
         onClick={onOpen} 
         className="w-full rounded-3xl cursor-pointer transition hover:scale-[1.01] p-[1.5px] bg-gradient-to-br from-purple-500 via-fuchsia-400 to-pink-400 shadow-xl hover:shadow-2xl">
      <div className="rounded-3xl bg-purple-50 p-6 shadow-sm border border-white">
        
        <div className="flex justify-between items-start">
          <div className="flex flex-1 items-start gap-3">
            {/* ロゴ表示 */}
            {showDetails && (
              company.logo ? (
                <img src={company.logo} alt="logo" className="h-14 w-14 rounded-2xl object-cover border border-white shadow-sm bg-white" />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-white border border-pink-100" />
              )
            )}
            
            {/* 名前と業界の表示部分 */}
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800">{company.name}</h2>
              <p className="text-sm font-medium text-gray-500 mt-1 inline-block px-2 py-0.5 rounded-lg">
                {company.industry}
              </p>
            </div>
          </div>

          {/* 右側：バッジと操作ボタン */}
          <div className="flex gap-3 items-start shrink-0">
            {showDetails && (
              <div className="flex flex-col items-end gap-2">
                <Badge colorClass="bg-pink-500">{company.progress}</Badge>
                <Badge colorClass="bg-purple-500">{company.priority}</Badge>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-400">
              {dragEnabled && (
                <div {...listeners} {...attributes} className="cursor-grab p-1" onClick={(e) => e.stopPropagation()}>
                  <GripVertical size={18} />
                </div>
              )}

              {/* 3点リーダーメニュー (外側クリック対応) */}
              {showEditButton && (
                <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)} 
                    className="p-2 hover:text-pink-500 transition rounded-xl hover:bg-white/60"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-1 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50 min-w-[130px] py-1">
                      <button 
                        className="block w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-pink-50 transition" 
                        onClick={() => {
                          setMenuOpen(false);
                          onEdit();
                        }}
                      >
                        編集する
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}