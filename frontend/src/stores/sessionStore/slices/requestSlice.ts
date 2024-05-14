import type { SessionStateCreator } from "@/stores/sessionStore";
import { axiosRequest } from "@/utils/request";
import type { Axios } from "axios";
import axios from "axios";

export type RequestSlice = Pick<
  Axios,
  "request" | "get" | "delete" | "options" | "post" | "put" | "patch"
> & {
  _request: typeof axiosRequest;
};

export const createRequestSlice: SessionStateCreator<RequestSlice> = (
  set,
  get
) => ({
  _request: axiosRequest,

  async request(config) {
    const state = get();
    try {
      return await state._request(config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail || "";
        if (detail && typeof detail == "string" && /token/i.test(detail)) {
          await state.logout();
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
