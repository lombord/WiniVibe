import { wait } from "@/utils/request";
import { useLayoutEffect, useRef } from "react";

export type IntersectCallback = () => boolean | void | Promise<boolean | void>;

export function useIntersection<T extends HTMLElement>(
  cb?: IntersectCallback,
  options?: IntersectionObserverInit,
) {
  const targetRef = useRef<T>(null);

  useLayoutEffect(() => {
    if (!(targetRef.current && cb)) return;

    const target = targetRef.current;
    const unobserve = () => inter.disconnect();

    const inter = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;

      const stop = await Promise.resolve(cb());
      if (stop) {
        unobserve();
        target.style.display = "none";
      }
    }, options);

    inter.observe(target);

    return unobserve;
  }, [targetRef]);

  return targetRef;
}
