import Input from "./Input";
import InputEmail from "./InputEmail";
import InputFile from "./InputFile";
import InputImage from "./InputImage";
import InputMask from "./InputMask";
import InputPassword from "./InputPassword";
import InputPhone from "./InputPhone";
import Textarea from "./Textarea";

export const WidgetsMap = {
  input: Input,
  mask: InputMask,
  phone: InputPhone,
  email: InputEmail,
  password: InputPassword,
  text: Textarea,
  file: InputFile,
  image: InputImage,
};

export type Widgets = typeof WidgetsMap;

export default WidgetsMap;
