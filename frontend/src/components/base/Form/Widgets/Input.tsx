import { FC, useCallback, useImperativeHandle } from "react";
import { Input as NextInput } from "@nextui-org/react";
import type { InputProps } from "./types";
import { keepMaxLength } from "@/utils/validation";

type ChangeEventHandler = React.ChangeEventHandler<HTMLInputElement>;

const REGEX_ERROR =
  "Invalid input format. Please ensure your input follows the required pattern.";

const Input: FC<InputProps> = ({
  value,
  setValue,
  handleValidate,
  maxLength,
  regexPattern,
  regexError = REGEX_ERROR,
  widgetRef,
  autoComplete = "on",
  ...props
}) => {
  const handleChange: ChangeEventHandler = useCallback(
    ({ target }) => {
      const newVal = keepMaxLength(target.value, maxLength);
      setValue(newVal);
    },
    [maxLength, setValue],
  );

  useImperativeHandle(
    widgetRef,
    () => ({
      validate: () => {
        if (handleValidate) {
          return handleValidate(value);
        }

        if (value && regexPattern && !regexPattern.test(value)) {
          throw new Error(regexError);
        }

        return value;
      },
    }),
    [value],
  );

  return (
    <NextInput
      value={value || ""}
      autoComplete={autoComplete}
      radius="lg"
      classNames={{ input: "font-medium" }}
      onChange={handleChange}
      {...props}
    />
  );
};

export default Input;
