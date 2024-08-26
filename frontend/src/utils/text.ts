import { lruCache } from "./cache";

export const keyToLabel = lruCache((key: string): string => {
  if (!key) return "";
  key = key.replace(/([a-z])([A-Z])|[_-]+/g, "$1 $2");
  return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
});

export const replaceAt = (
  value: string,
  idx: number,
  replace: string,
): string => {
  if (replace === value[idx]) return value;
  return value.substring(0, idx) + replace + value.substring(idx + 1);
};
