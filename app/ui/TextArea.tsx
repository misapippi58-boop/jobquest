import { fieldStyle } from "./styles";

export default function TextArea({ className = "", ...props }: any) {
  return (
    <textarea
      {...props}
      className={`${fieldStyle} font-memo ${className}`}
    />
  );
}