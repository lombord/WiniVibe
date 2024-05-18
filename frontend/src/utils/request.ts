import axios from "axios";

type LoadingSetter = (loading: boolean) => void;
export type PromiseCB = () => any;

export const axiosRequest = axios.create({
  baseURL: "/api",
  timeout: 25e3,
  xsrfHeaderName: "X-CSRFToken",
  xsrfCookieName: "csrftoken",
});

export async function animatePromise<T extends Promise<any>>(
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
  if (!(cb && setLoading)) return;
  animatePromise(cb(), setLoading);
}

export function wait(ms: number = 100): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
