import { Variants, Variant } from "framer-motion";

const reverseProps = new Set(["x", "y", "z", "opacity"]);

function reverseVariant(variant: Variant) {
  return Object.fromEntries(
    Object.entries(variant).map(([key, val]) => {
      if (reverseProps.has(key) && Array.isArray(val)) {
        val = (val as number[]).slice().reverse();
      }
      return [key, val];
    }),
  );
}

export interface ToggleProps {
  leftKey?: string;
  rightKey?: string;
  leftVar?: Variant;
  rightVar: Variant;
}

export function getToggleVars({
  leftKey = "left",
  rightKey = "right",
  leftVar,
  rightVar,
}: ToggleProps): Variants {
  return {
    [leftKey]: { ...reverseVariant(rightVar), ...leftVar },
    [rightKey]: rightVar,
  };
}

export function invertCopy<T extends Variant, K extends keyof T>(
  variant: T,
  props: Iterable<K> | string,
): T {
  const propsSet = new Set(
    typeof props === "string" ? (props.split(/\s*,\s*/) as Iterable<K>) : props,
  );
  const result = {} as T;
  let key, val;
  for ([key, val] of Object.entries(variant)) {
    if (propsSet.has(key as K) && val) {
      val = Array.isArray(val) ? val.map((v) => -v) : -val;
    }
    result[key as K] = val;
  }
  return result as T;
}
