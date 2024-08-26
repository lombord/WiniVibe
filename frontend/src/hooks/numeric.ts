import { clamp } from "@/utils/math";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

type ClampSetter = (value: number, forceRange?: boolean) => void;
type ClampValue = number;

export const useClamp = (
  initial: number = 0,
  min: number = 0,
  max: number = 0,
) => {
  const [value, setValue] = useState(initial);
  const minRef = useRef(min);
  const maxRef = useRef(min);

  const clampSet = useCallback((nValue: ClampValue, forceRange = true) => {
    if (!Number.isNaN(nValue)) {
      setValue(
        forceRange ? clamp(minRef.current, nValue, maxRef.current) : nValue,
      );
    }
  }, []);

  useLayoutEffect(() => {
    minRef.current = min;
    maxRef.current = max;
    clampSet(value);
  }, [min, max]);

  return [value, clampSet] as const;
};

export const infinityFb = (value: number, fallback: number = 0) =>
  value === Infinity ? fallback : value;
