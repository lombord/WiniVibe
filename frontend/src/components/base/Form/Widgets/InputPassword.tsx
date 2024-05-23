import { FC, useState } from "react";
import Input from "./Input";
import { PasswordProps } from "./types";
import { passwordRegex } from "@/utils/constants";
import { Button } from "@nextui-org/react";
import { Eye, EyeSlash } from "iconsax-react";

const DEFAULT_ERROR =
  "Password must be minimum 8 characters, one uppercase, one lowercase and one number";

const InputPassword: FC<PasswordProps> = ({
  newPassword = false,
  label = "Password",
  errorMessage = DEFAULT_ERROR,
  autoComplete = "current-password",
  ...props
}) => {
  const [isVisible, setVisible] = useState(false);

  let regexPattern;
  if (newPassword) {
    regexPattern = passwordRegex;
    autoComplete = "new-password";
  }
  return (
    <div className="relative flex items-center">
      <Input
        {...props}
        type={isVisible ? "text" : "password"}
        regexPattern={regexPattern}
        autoComplete={autoComplete}
        regexError={errorMessage}
        label={label}
      />
      <Button
        onPress={() => setVisible(!isVisible)}
        isIconOnly
        radius="full"
        disableRipple
        disableAnimation
        className="absolute right-2 
        mt-3 h-8 bg-transparent p-0 
        text-foreground-400 opacity-60 !transition-colors 
        hover:text-primary hover:opacity-80"
      >
        {isVisible ? (
          <EyeSlash variant="Bold" size="90%" />
        ) : (
          <Eye variant="Bold" size="90%" />
        )}
      </Button>
    </div>
  );
};

export default InputPassword;
