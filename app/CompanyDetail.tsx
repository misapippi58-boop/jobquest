type Props = {
  company: any;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

import {
  Card,
  Button,
} from "./ui";

import { Trash2 } from "lucide-react";

export default function CompanyDetail({
  company,
  onBack,
  onEdit,
  onDelete,
}: Props) {
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
        z-50
      "
      onClick={onBack}
    >
    <main
      onClick={(e) => e.stopPropagation()}
      className="
        w-full
        max-w-xl
        bg-pink-50
        p-6
        rounded-3xl
        max-h-[90vh]
        overflow-y-auto
      "
    >

      {/* 上部ナビ */}
      <div className="flex justify-between items-center mb-6">

        <Button
          variant="white"
          onClick={onBack}
        >
          戻る
        </Button>

          <Button onClick={onEdit}>
            編集
          </Button>
        
        </div>

      {/* メインカード */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-500 via-fuchsia-400 to-pink-400 p-[1.5px] shadow-xl">

        <div className="rounded-3xl bg-purple-50 p-8 space-y-6">

          {/* ヘッダー */}
          <div className="flex justify-between items-start">

            <div className="flex items-start gap-3">

              {company.logo ? (
                <img
                  src={company.logo}
                  className="
                    h-20
                    w-20
                    rounded-2xl
                    object-cover
                    border
                    border-pink-100
                    bg-white
                    shadow-sm
                  "
                />
              ) : (
                <div
                  className="
                    h-20
                    w-20
                    rounded-2xl
                    bg-white
                    border
                    border-pink-100
                    shadow-sm
                  "
                />
              )}

              <div>
                <h1 className="text-4xl font-extrabold text-gray-800">
                  {company.name}
                </h1>

                <p className="text-gray-500 mt-2">
                  {company.industry || "ー"}
                </p>
              </div>

            </div>

            <div className="flex flex-col gap-2 items-end">

              <div className="rounded-full bg-pink-500 px-3 py-1 text-sm text-white font-bold">
                {company.progress}
              </div>

              <div className="rounded-full bg-purple-500 px-3 py-1 text-sm text-white font-bold">
                {company.priority}
              </div>

            </div>

          </div>

          {/* グリッド */}
          <div className="grid grid-cols-2 gap-3">

            <Info
              label="本社"
              value={
                [
                  company.prefecture,
                  company.city,
                  company.address,
                ]
                  .filter(Boolean)
                  .join("")
              }
            />
            <Info label="勤務地" value={company.workLocation} />
            <Info label="従業員数" value={company.employees} />
            <Info label="URL" value={company.url} />

          </div>

          {/* カルチャー */}
          <Block label="カルチャー" value={company.culture} />

          {/* 強み */}
          <Block label="強み" value={company.strengths} />

          {/* メモ */}
          <Block label="メモ" value={company.memo} />

          <Card>
            <p className="text-xs text-gray-500">
              スケジュール
            </p>

            <div className="mt-2 space-y-2">
              {company.schedule?.length ? (
                company.schedule.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-white p-3"
                  >
                    <p className="font-bold">
                      {item.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.date}
                      {item.time && ` ${item.time}`}
                    </p>

                    <p className="text-sm text-gray-600">
                      {item.place}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-800">
                  ー
                </p>
              )}
            </div>
          </Card>

        </div>
      </div>

      <div className="mt-6">
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

      </div>
    </main>
   </div>
  );
}

/* 小さいカード */
function Info({ label, value }: any) {
  return (
    <Card>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-gray-800">
        {value || "ー"}
      </p>
    </Card>
    
  );
}

/* 大きいテキスト系 */
function Block({ label, value }: any) {
  return (
    <Card>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-gray-800 whitespace-pre-wrap">
        {value || "ー"}
      </p>
    </Card>
  );
}