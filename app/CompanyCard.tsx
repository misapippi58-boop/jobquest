import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Pencil, GripVertical } from "lucide-react";
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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: company.id,
    disabled: !dragEnabled,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

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
              {/* 業界をタグ形式で表示（業界カードでも企業カードでも表示されます） */}
              <p className="text-sm font-medium text-gray-500 mt-1  inline-block px-2 py-0.5 rounded-lg">
                {company.industry}
              </p>
            </div>
          </div>

          {/* 右側：バッジと操作ボタン */}
          <div className="flex gap-3 shrink-0">
            {showDetails && (
              <div className="flex flex-col items-end gap-2">
                <Badge colorClass="bg-pink-500">{company.progress}</Badge>
                <Badge colorClass="bg-purple-500">{company.priority}</Badge>
              </div>
            )}

            <div className="flex flex-col items-center gap-2 text-gray-400">
              {dragEnabled && (
                <div {...listeners} {...attributes} className="cursor-grab">
                  <GripVertical size={18} />
                </div>
              )}
              {/* 鉛筆マークは showEditButton が true の時だけ出る */}
              {showEditButton && (
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="hover:text-pink-500 transition">
                  <Pencil size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}