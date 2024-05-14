export function keyToLabel(key: string): string {
  if (!key) return "";
  key = key.replace(/([a-z])([A-Z])|[_-]+/g, "$1 $2");
  return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
}

export function hasOwn<T>(target: T, key: string | symbol | number): boolean {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export function hasProps<T extends {}>(obj: T): boolean {
  return !!Object.keys(obj).length;
}
