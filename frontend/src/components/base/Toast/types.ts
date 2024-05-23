export type ToastTypes = "message" | "error" | "warning" | "info" | "success";

export type ToastItemId = number;

export type ToastItem = {
  id: ToastItemId;
  type?: ToastTypes;
  title?: string;
  message: string;
  duration: number;
};

export type ToastItems = Map<number, ToastItem>;

export type RemoveFunction = (id: number) => void;

export type CommonMsgProps = {
  removeMessage: RemoveFunction;
};
