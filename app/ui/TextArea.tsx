import { fieldStyle } from "./styles";

export default function TextArea(props: any) {
  return (
    <textarea
      {...props}
      className={fieldStyle}
    />
  );
}