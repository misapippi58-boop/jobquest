import { formatDate } from "../lib/formatDate";
import type { ScheduleItem } from "../types/company";

// 外から受け取るデータの型を定義します
interface DashboardStatsProps {
  totalCompanies: number;
  nextSchedule: (ScheduleItem & { companyName: string }) | null;
  mounted: boolean;
}

export const DashboardStats = ({
  totalCompanies,
  nextSchedule,
  mounted,
}: DashboardStatsProps) => {
  return (
    <div className="flex gap-3">
      {/* 登録企業 */}
      <div className="rounded-2xl bg-white p-3 shadow-sm border border-pink-100 w-24">
        <p className="text-xs text-gray-800">登録企業</p>
        <div className="mt-1 h-14 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <span className="text-2xl font-extrabold text-gray-800 leading-none">
              {mounted ? totalCompanies : 0}
            </span>
          </div>
          <span className="text-xs text-gray-500 self-end">件</span>
        </div>
      </div>

      {/* 直近の予定 */}
      <div className="rounded-2xl bg-white p-3 shadow-sm border border-pink-100 w-64">
        <p className="text-xs text-gray-500">直近の予定</p>
        {nextSchedule ? (
          <>
            <p className="mt-0.5 font-bold text-gray-800">
              {nextSchedule.title}
              <span className="ml-2 text-sm font-normal text-gray-500">
                {formatDate(nextSchedule.date)}
                {nextSchedule.time && ` ${nextSchedule.time}`}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {nextSchedule.companyName}
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm text-gray-400">予定なし</p>
        )}
      </div>
    </div>
  );
};