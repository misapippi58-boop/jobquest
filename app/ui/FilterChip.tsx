type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  variant?: "white" | "pink" | "purple";
};

export default function FilterChip({
  children,
  onClick,
  active = false,
  variant = "white",
}: Props) {

  const colors = {
    white: active
      ? "bg-gray-200"
      : "bg-white",

    pink: active
      ? "bg-pink-300"
      : "bg-pink-200",

    purple: active
      ? "bg-purple-200"
      : "bg-purple-100",
  };

  return (
    <button
      onClick={onClick}
      className={`
        rounded-full
        px-4
        py-2
        text-sm
        font-medium
        transition
        ${colors[variant]}
      `}
    >
      {children}
    </button>
  );
}