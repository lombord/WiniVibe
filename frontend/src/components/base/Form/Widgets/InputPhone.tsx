import { FC } from "react";
import InputMask from "./InputMask";
import { InputPhoneProps } from "./types";
import { Call } from "iconsax-react";

const DEFAULT_ERROR = "Invalid phone number.";

const InputPhone: FC<InputPhoneProps> = ({
  label = "Phone",
  autoComplete = "tel",
  yieldMasked = false,
  errorMessage = DEFAULT_ERROR,
  ...props
}) => {
  return (
    <InputMask
      {...props}
      type="tel"
      autoComplete={autoComplete}
      label={label}
      mask="+998(00)000-00-00"
      yieldMasked={yieldMasked}
      errorMessage={errorMessage}
      endContent={
        <span className="text-foreground-400">
          <Call variant="Bold" size="24" color="currentColor" />
        </span>
      }
    />
  );
};

export default InputPhone;
