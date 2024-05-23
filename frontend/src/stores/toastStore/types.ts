import type {
  RemoveFunction,
  ToastItem,
  ToastItems,
  ToastTypes,
} from "@/components/base/Toast/types";

type ToastNoId = Omit<ToastItem, "id">;

export type ToastStateItem =
  | ToastItem["message"]
  | (Partial<ToastNoId> & Pick<ToastItem, "message">);

export type ToastStateMessage = ToastStateItem | ToastStateItem[];

export interface ToastStates {
  toasts: ToastItems;
  id: number;
}

export type ToastActions = {
  _getNewId(): number;
  clearMessages(): void;
  removeMessage: RemoveFunction;
  _showMessage(message: ToastStateItem, type?: ToastTypes): void;
  showMessages(messages: ToastStateItem[], type?: ToastTypes): void;
  dispatchMessage(message: ToastStateMessage, type?: ToastTypes): void;
} & {
  [K in ToastTypes as `show${Capitalize<K & string>}`]: (
    message: ToastStateMessage,
  ) => void;
};

export type ToastState = ToastStates & ToastActions;
