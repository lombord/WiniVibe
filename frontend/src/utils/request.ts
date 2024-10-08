import axios from "axios";

type LoadingSetter = (loading: boolean) => void;
export type PromiseCB = () => any;

export const axiosBase = axios.create({
  baseURL: "/api",
  timeout: 25e3,
  xsrfCookieName: import.meta.env.VITE_API_CSRF_COOKIE_KEY,
  xsrfHeaderName: import.meta.env.VITE_API_CSRF_HEADER_NAME,
});

export async function animatePromise<T>(
  promise: T,
  setLoading: LoadingSetter,
): Promise<Awaited<T>> {
  if (promise instanceof Promise) setLoading(true);
  try {
    return await Promise.resolve(promise);
  } finally {
    setLoading(false);
  }
}

export function animateCB(cb?: PromiseCB, setLoading?: LoadingSetter) {
  if (cb && setLoading) {
    animatePromise(cb(), setLoading);
  }
}

export function wait(ms: number = 100): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
