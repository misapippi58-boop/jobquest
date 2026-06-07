"use client";

import { Input, Select, TextArea, Card, Button } from "./ui";
import { Trash2 } from "lucide-react";

// 定数
const PROGRESS_LIST = ["登録完了", "説明会", "書類選考", "一次面接", "二次面接", "最終面接", "内定", "不採用", "その他"] as const;
const PRIORITY_LIST = ["第1志望", "第2志望", "第3志望", "第4志望", "第5志望", "未設定"] as const;
const PREFECTURES = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-700 mb-1">{label}</p>
      {children}
    </div>
  );
}

type Props = {
  draft: any;
  setDraft: any;
};

export default function CompanyForm({ draft, setDraft }: Props) {
  // 入力内容を更新する共通関数
  const handleChange = (field: string) => (e: any) => {
    setDraft((prev: any) => ({ ...prev, [field]: e.target.value }));
  };

  // 個別項目を更新する共通関数
  const handleScheduleChange = (index: number, field: string, value: string) => {
    const copy = [...(draft.schedule || [])];
    copy[index] = { ...copy[index], [field]: value };
    setDraft((prev: any) => ({ ...prev, schedule: copy }));
  };

  return (
    <div className="space-y-4">
      <Field label="企業名">
        <Input placeholder="企業名" value={draft.name || ""} onChange={handleChange("name")} />
      </Field>

      <Field label="業界">
        <Input placeholder="IT / メーカー / 商社 など" value={draft.industry || ""} onChange={handleChange("industry")} />
      </Field>

      <Field label="URL">
        <Input placeholder="https://xxxxxxx" value={draft.url || ""} onChange={handleChange("url")} />
      </Field>

      <Field label="進捗ステータス">
        <Select value={draft.progress || ""} onChange={handleChange("progress")}>
          {PROGRESS_LIST.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        {draft.progress === "その他" && (
          <Input className="mt-2" placeholder="自由入力" value={draft.progressCustom || ""} onChange={handleChange("progressCustom")} />
        )}
      </Field>

      <Field label="志望度">
        <Select value={draft.priority || ""} onChange={handleChange("priority")}>
          {PRIORITY_LIST.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>
      </Field>

      <Field label="本社所在地">
        {(draft.prefecture || draft.city || draft.address) && (
          <Card className="bg-white mb-2">
            <p className="text-xs text-gray-500">現在の住所</p>
            <p className="mt-1 font-bold text-gray-800">
              {[draft.prefecture, draft.city, draft.address].filter(Boolean).join("")}
            </p>
          </Card>
        )}

        <Select value={draft.country || ""} onChange={handleChange("country")}>
          <option value="">選択してください</option>
          <option value="日本">日本</option>
          <option value="海外">海外</option>
        </Select>

        {draft.country === "日本" && (
          <div className="mt-2 space-y-2">
            <Select value={draft.prefecture || ""} onChange={handleChange("prefecture")}>
              <option value="">都道府県を選択</option>
              {PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </Select>
            {draft.prefecture && <Input value={draft.city || ""} onChange={handleChange("city")} placeholder="市区町村" />}
            {draft.city && <Input value={draft.address || ""} onChange={handleChange("address")} placeholder="番地・建物名" />}
          </div>
        )}

        {draft.country === "海外" && (
          <div className="mt-2 space-y-2">
            <Input value={draft.foreignCountry || ""} onChange={handleChange("foreignCountry")} placeholder="国名" />
            <Input value={draft.foreignCity || ""} onChange={handleChange("foreignCity")} placeholder="都市名" />
          </div>
        )}
      </Field>

      <Field label="勤務地">
        <Select value={draft.workLocation || ""} onChange={handleChange("workLocation")}>
          <option value="">勤務地を選択</option>
          <option value="全国">全国</option>
          <option value="不明">不明</option>
          <option value="海外">海外</option>
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>{pref}</option>
          ))}
        </Select>
      </Field>

      <Field label="従業員数">
        <Input placeholder="1000人" value={draft.employees || ""} onChange={handleChange("employees")} />
      </Field>

      <Field label="カルチャー">
        <TextArea placeholder="若手多め、挑戦的 など" value={draft.culture || ""} onChange={handleChange("culture")} />
      </Field>

      <Field label="強み・特徴">
        <TextArea placeholder="福利厚生が強い など" value={draft.strengths || ""} onChange={handleChange("strengths")} />
      </Field>

      <Field label="メモ">
        <TextArea placeholder="自由メモ" value={draft.memo || ""} onChange={handleChange("memo")} />
      </Field>

      <Field label="企業ロゴ">
        {draft.logo && (
          <img src={draft.logo} alt="logo" className="mb-3 h-20 w-20 rounded-2xl object-cover border border-pink-100" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => {
              setDraft((p: any) => ({ ...p, logo: reader.result }));
            };
            reader.readAsDataURL(file);
          }}
        />
      </Field>

      <Field label="スケジュール">
        <Button
          onClick={() =>
            setDraft((p: any) => ({
              ...p,
              schedule: [...(p.schedule || []), { id: crypto.randomUUID(), title: "", date: "", time: "", place: "" }],
            }))
          }
        >
          ＋予定追加
        </Button>

        {draft.schedule?.map((item: any, index: number) => (
          <Card key={item.id} className="mt-3 bg-white">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-bold">予定 {index + 1}</p>
                <Button
                  variant="icon"
                  onClick={() => {
                    if (!confirm("削除しますか？")) return;
                    setDraft((p: any) => ({
                      ...p,
                      schedule: p.schedule.filter((_: any, i: number) => i !== index),
                    }));
                  }}
                >
                  <Trash2 size={18} className="text-red-500" />
                </Button>
              </div>

              <Input placeholder="予定名" value={item.title || ""} onChange={(e: any) => handleScheduleChange(index, "title", e.target.value)} />
              <Input type="date" value={item.date || ""} onChange={(e: any) => handleScheduleChange(index, "date", e.target.value)} />
              <Input type="time" value={item.time || ""} onChange={(e: any) => handleScheduleChange(index, "time", e.target.value)} />
              <Input placeholder="場所" value={item.place || ""} onChange={(e: any) => handleScheduleChange(index, "place", e.target.value)} />
            </div>
          </Card>
        ))}
      </Field>
    </div>
  );
}