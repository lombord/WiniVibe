import type { SessionStateCreator } from "@/stores/sessionStore";
import { SessionUser } from "@/types/user";

type SessionStates = {
  user: SessionUser | null;
};

type SessionComputed = {
  isLoggedIn: boolean;
};

type SessionActions = {
  computed: SessionComputed;
  setUser(user: SessionUser): void;
  signIn(username: string, password: string): Promise<SessionUser | never>;
  logout(): Promise<void>;
  loadSession(): Promise<boolean>;
};

export type SessionSlice = SessionStates & SessionActions;

const initialStates: SessionStates = {
  user: null,
};

export const createSessionSlice: SessionStateCreator<SessionSlice> = (
  set,
  get,
) => ({
  ...initialStates,
  computed: {
    get isLoggedIn() {
      return !!get().user;
    },
  },

  setUser(user) {
    set((state) => {
      state.user = user;
    });
  },

  async signIn(username, password) {
    if (!get().computed.isLoggedIn) {
      const data = { username, password };
      const response = await get().post<SessionUser>("auth/login/", data);
      get().setUser(response.data);
    }
    return get().user as SessionUser;
  },

  async logout() {
    if (get().computed.isLoggedIn) {
      await get().post("auth/logout/");
      set(initialStates);
    }
  },

  async loadSession() {
    try {
      const response = await get().get<SessionUser>("session/");
      set((state) => {
        state.user = response.data;
      });
      return true;
    } catch (error) {
      return false;
    }
  },
});
