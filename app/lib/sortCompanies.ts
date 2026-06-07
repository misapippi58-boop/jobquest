import type { Company } from "../types/company";

export function sortCompanies(
  companies: Company[],
  sortMode: string
) {
  const result = [...companies];

  if (sortMode === "created") {
    return result.reverse();
  }

  if (sortMode === "name") {
    return result.sort((a, b) =>
      a.name.localeCompare(b.name, "ja")
    );
  }

  if (sortMode === "priority") {
    const order = {
      第1志望: 1,
      第2志望: 2,
      第3志望: 3,
      第4志望: 4,
      第5志望: 5,
      未設定: 99,
    };

    return result.sort(
      (a, b) =>
        (order[a.priority as keyof typeof order] ?? 99) -
        (order[b.priority as keyof typeof order] ?? 99)
    );
  }

  if (sortMode === "progress") {
    const progressOrder = {
      登録完了: 1,
      説明会: 2,
      書類選考: 3,
      一次面接: 4,
      二次面接: 5,
      最終面接: 6,
      内定: 7,
      不採用: 99,
    };

    return result.sort(
      (a, b) =>
        (progressOrder[
          a.progress as keyof typeof progressOrder
        ] ?? 999) -
        (progressOrder[
          b.progress as keyof typeof progressOrder
        ] ?? 999)
    );
  }

  if (sortMode === "schedule") {
    return result.sort((a, b) => {
      const dateA =
        a.schedule?.[0]?.date ?? "9999-12-31";

      const dateB =
        b.schedule?.[0]?.date ?? "9999-12-31";

      return (
        new Date(dateA).getTime() -
        new Date(dateB).getTime()
      );
    });
  }

  return result;
}