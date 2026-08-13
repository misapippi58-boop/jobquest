import { arrayMove } from "@dnd-kit/sortable";
import { Company } from "../../types/company";
import { INDUSTRY_DB } from "../../data/industryData";

export function moveCard(cards: Company[], activeId: string, overId: string): Company[] {
  const oldIndex = cards.findIndex((card) => card.id === activeId);
  const newIndex = cards.findIndex((card) => card.id === overId);
  return arrayMove(cards, oldIndex, newIndex);
}

export function sortIndustryCards(cards: Company[], sortType: string): Company[] {
  const cardsCopy = [...cards];

  if (sortType === "manual") {
    return cardsCopy; // 任意順（そのまま）
  } else if (sortType === "salary") {
    // 年収順（高い順）
    return cardsCopy.sort((a, b) => {
      const getSalary = (name: string) => {
        let salaryStr = "";
        Object.values(INDUSTRY_DB).forEach((industry: any) => {
          if (industry.specializedJobs && industry.specializedJobs[name]) {
            salaryStr = industry.specializedJobs[name].salary || "";
          }
        });
        const matches = salaryStr.match(/\d+/g);
        return matches ? parseInt(matches[0], 10) : 0;
      };
      return getSalary(b.name) - getSalary(a.name);
    });
  } else if (sortType === "created") {
    // 登録順（IDの古い順、または新しい順）
    return cardsCopy.sort((a, b) => Number(a.id) - Number(b.id));
  }

  return cardsCopy;
}