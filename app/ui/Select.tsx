import { fieldStyle } from "./styles";

export default function Select(props: any) {
  return (
    <select
      {...props}
      className={fieldStyle}
    />
  );
}