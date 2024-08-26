import { useLayoutEffect } from "react";

export function useTrackState<T>(state: T, key: string): void {
  useLayoutEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
}
