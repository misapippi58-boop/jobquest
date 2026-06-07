type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        rounded-2xl
        bg-white
        p-4
        shadow-sm
        border
        border-pink-100
        ${className}
      `}
    >
      {children}
    </div>
  );
}