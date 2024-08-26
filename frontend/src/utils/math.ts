export function randInt(a: number): number;
export function randInt(a: number, b: number): number;
export function randInt(a: number, b?: number): number {
  if (b == null) {
    b = a;
    a = 0;
  }
  return Math.floor(Math.random() * (b - a) + a);
}

export function clamp(min: number, a: number, max: number): number {
  return Math.max(min, Math.min(max, a));
}

export const formatBytes = (bytes: string | number, decimals = 2) => {
  bytes = +bytes;
  if (!bytes) return "0B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
};
