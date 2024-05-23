import { FC } from "react";
import Input from "./Input";
import { EmailProps } from "./types";
import { emailRegex } from "@/utils/constants";

const DEFAULT_ERROR =
  "Invalid email format. Please enter a valid email address.";

const InputEmail: FC<EmailProps> = ({
  label = "Email",
  errorMessage = DEFAULT_ERROR,
  autoComplete = "email",
  ...props
}) => {
  return (
    <Input
      {...props}
      type="email"
      regexPattern={emailRegex}
      regexError={errorMessage}
      autoComplete={autoComplete}
      label={label}
    />
  );
};

export default InputEmail;
