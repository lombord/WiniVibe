import { FC, useCallback, useImperativeHandle } from "react";
import { Textarea as NextTextArea } from "@nextui-org/react";
import type { TextAreaProps } from "./types";
import { validateLength } from "@/utils/validation";

type ChangeEventHandler = React.ChangeEventHandler<HTMLInputElement>;

const Textarea: FC<TextAreaProps> = ({
  value,
  setValue,
  maxLength,
  widgetRef,
  ...props
}) => {
  const handleChange: ChangeEventHandler = useCallback(
    ({ target: { value } }) => {
      setValue(validateLength(value, maxLength));
    },
    [maxLength, setValue],
  );

  useImperativeHandle(widgetRef, () => ({ validate: () => value }), [value]);

  return (
    <NextTextArea value={value || ""} onChange={handleChange} {...props} />
  );
};

export default Textarea;
