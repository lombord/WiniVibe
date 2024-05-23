import { emailRegex } from "./constants";

export const validateEmail = (email: string) => {
  return emailRegex.test(email);
};

export const keepMaxLength = (str: string, maxLength?: number) => {
  if (maxLength != null && str.length > maxLength) {
    str = str.slice(0, maxLength);
  }
  return str;
};
