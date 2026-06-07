import type { Company } from "../types/company";

export function getNextSchedule(
  companies: Company[]
) {
  const allSchedules = companies.flatMap(
    (company) =>
      (company.schedule || []).map((schedule) => ({
        ...schedule,
        companyName: company.name,
      }))
  );

  return allSchedules
    .filter((s) => s.date)
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    )[0];
}