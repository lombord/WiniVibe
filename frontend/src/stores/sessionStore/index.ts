import { create, type StateCreator } from "zustand";
import type { RequestSlice } from "./slices/requestSlice";
import { immer } from "zustand/middleware/immer";
import type { SessionSlice } from "./slices/sessionSilce";
import { createRequestSlice } from "./slices/requestSlice";
import { createSessionSlice } from "./slices/sessionSilce";
import { createSelectors } from "@/stores/utils";

type SessionBoundSlices = RequestSlice & SessionSlice;

export type SessionStateCreator<SliceState> = StateCreator<
  SessionBoundSlices,
  [["zustand/immer", never], never],
  [],
  SliceState
>;

const sessionStore = create<SessionBoundSlices>()(
  immer((...args) => ({
    ...createRequestSlice(...args),
    ...createSessionSlice(...args),
  })),
);

export const useSessionStore = createSelectors(sessionStore);

export default sessionStore;
