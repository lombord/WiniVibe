import type { SessionStateCreator } from "@/stores/sessionStore";
import { axiosBase } from "@/utils/request";
import {
  type AxiosRequestConfig,
  type AxiosResponse,
  type Axios,
  isAxiosError,
} from "axios";

type CheckTokenPromise = Promise<AxiosResponse<undefined, undefined>>;

export type RequestSlice = Pick<
  Axios,
  "get" | "delete" | "options" | "post" | "put" | "patch"
> & {
  axiosInst: typeof axiosBase;
  checkPromise: CheckTokenPromise | null;
  checkToken: () => CheckTokenPromise | never;
  request<T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>,
    reclaimToken?: boolean,
  ): Promise<R>;
};

const INVALID_TOKEN_RE = /token/i;

export const createRequestSlice: SessionStateCreator<RequestSlice> = (
  set,
  get,
) => ({
  axiosInst: axiosBase,
  checkPromise: null,

  checkToken() {
    let prom = get().checkPromise;
    if (prom) return prom;

    prom = get()
      .axiosInst.post("auth/check/")
      .finally(() => {
        set({ checkPromise: null });
      });
    set({ checkPromise: prom });
    return prom;
  },

  async request(config, reclaimToken: boolean = true) {
    try {
      return await get().axiosInst(config);
    } catch (error) {
      if (isAxiosError(error)) {
        const detail = error.response?.data?.detail || "";
        if (
          reclaimToken &&
          detail &&
          typeof detail === "string" &&
          INVALID_TOKEN_RE.test(detail)
        ) {
          try {
            await get().checkToken();
            return await get().request(config, false);
          } catch (error) {
            get().resetRequestStore();
          }
        }
      }
      throw error;
    }
  },

  get(url, config) {
    return get().request({ ...config, method: "get", url });
  },

  options(url, config) {
    return get().request({ ...config, method: "options", url });
  },

  delete(url, config) {
    return get().request({ ...config, method: "delete", url });
  },

  post(url, data, config) {
    return get().request({ ...config, method: "post", url, data });
  },

  put(url, data, config) {
    return get().request({ ...config, method: "put", url, data });
  },

  patch(url, data, config) {
    return get().request({ ...config, method: "patch", url, data });
  },
});
