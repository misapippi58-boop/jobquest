import { fieldStyle } from "./styles";

export default function Input(props: any) {
  return (
    <input
      {...props}
      className={fieldStyle}
    />
  );
}