"use client";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "pink" | "danger" | "white" | "icon";
  className?: string;
  type?: "submit" | "button" | "reset"; // 💡 追加：ボタンの種類を指定可能に
  disabled?: boolean; // 💡 追加：無効化状態を指定可能に
};

export default function Button({
  children,
  onClick,
  variant = "pink",
  className = "",
  type = "button", // デフォルトは "button"
  disabled = false,
}: Props) {
  const styles = {
    pink:
     "px-4 py-2 font-title shadow bg-pink-500 text-white hover:bg-pink-600",

    danger:
      "px-4 py-2 font-title shadow-none text-red-500 bg-red-50 hover:bg-red-100",

    white:
      "px-4 py-2 font-title shadow bg-white text-gray-800 border border-pink-100 hover:bg-gray-50",
    
    icon:
      "bg-transparent shadow-none p-2 hover:bg-red-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-2xl
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}