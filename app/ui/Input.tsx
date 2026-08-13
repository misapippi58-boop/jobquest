import { fieldStyle } from "./styles";

export default function Input({ className = "", ...props }: any) {
  return (
    <input
      {...props}
      className={`${fieldStyle} font-memo ${className}`}
    />
  );
}