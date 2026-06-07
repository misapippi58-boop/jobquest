"use client";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "pink" | "danger" | "white"| "icon";
  className?: string;
};

export default function Button({
  children,
  onClick,
  variant = "pink",
  className = "",
}: Props) {
  const styles = {
    pink:
      "px-4 py-2 font-bold shadow bg-pink-500 text-white",

    danger:
      "px-4 py-2 font-bold shadow-none text-red-500 bg-red-50 hover:bg-red-100",

    white:
      "px-4 py-2 font-bold shadow bg-white text-gray-800 border border-pink-100",
    
    icon:
      "bg-transparent shadow-none p-2 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      className={`
        rounded-2xl
        transition
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}