export function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "ja-JP",
    {
      month: "numeric",
      day: "numeric",
    }
  );
}