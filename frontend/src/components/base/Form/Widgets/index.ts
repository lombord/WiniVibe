import Input from "./Input";
import InputEmail from "./InputEmail";
import InputPassword from "./InputPassword";
import Textarea from "./Textarea";

export const WidgetsMap = {
  input: Input,
  email: InputEmail,
  text: Textarea,
  password: InputPassword,
};

type Widgets = typeof WidgetsMap;

export function getWidget<T extends keyof Widgets>(key: T): Widgets[T] {
  return WidgetsMap[key];
}

export default WidgetsMap;
