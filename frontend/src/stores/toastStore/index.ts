import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { wait } from "@/utils/request";
import { createSelectors } from "../utils";
import { ToastState, ToastStates } from "./types";

const DEFAULT_DURATION = 5e3;

const MESSAGES_DELAY = 300;

const initialStates: ToastStates = {
  toasts: new Map(),
  id: 0,
};

const store = create<ToastState>()(
  immer((set, get) => ({
    ...initialStates,

    _getNewId() {
      set((state) => {
        state.id++;
      });
      const newId = get().id;
      return newId;
    },

    removeMessage(id) {
      set((state) => {
        state.toasts.delete(id);
        if (!state.toasts.size) {
          state.id = 0;
        }
      });
    },

    clearMessages() {
      set(() => ({ toasts: new Map(), id: 0 }));
    },

    _showMessage(message, type = "message") {
      const id = get()._getNewId();
      const tMessage = typeof message === "string" ? { message } : message;
      const item = { id, type, duration: DEFAULT_DURATION, ...tMessage };
      set((state) => {
        state.toasts.set(id, item);
      });
    },

    async showMessages(messages, type) {
      for (const message of messages.reverse()) {
        get()._showMessage(message, type);
        await wait(MESSAGES_DELAY);
      }
    },

    dispatchMessage(message, type) {
      if (Array.isArray(message)) {
        get().showMessages(message, type);
      } else {
        get()._showMessage(message, type);
      }
    },

    showMessage(message) {
      get().dispatchMessage(message, "message");
    },

    showError(message) {
      get().dispatchMessage(message, "error");
    },

    showWarning(message) {
      get().dispatchMessage(message, "warning");
    },

    showInfo(message) {
      get().dispatchMessage(message, "info");
    },

    showSuccess(message) {
      get().dispatchMessage(message, "success");
    },
  })),
);

export const useToastStore = createSelectors(store);

export default store;
