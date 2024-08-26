import { useLayoutEffect, useRef, useState } from "react";

type StateUpdateCB<T> = (newVal?: T) => void;

export const useStateRef = <T>(
  initial?: T | (() => T),
  updateCallback?: StateUpdateCB<T>,
) => {
  const [state, setState] = useState<T>(initial as T);
  const ref = useRef(initial as T);

  useLayoutEffect(() => {
    ref.current = state;
    updateCallback && updateCallback(state);
  }, [state]);

  return [state, setState, ref] as const;
};
