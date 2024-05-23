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

export function randInt(a: number): number;
export function randInt(a: number, b: number): number;
export function randInt(a: number, b?: number): number {
  if (b == null) {
    b = a;
    a = 0;
  }
  return Math.floor(Math.random() * (b - a) + a);
}

export function detectTouch(): boolean {
  let hasTouchScreen = false;

  if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in window.navigator) {
    hasTouchScreen = (window.navigator.msMaxTouchPoints as number) > 0;
  } else {
    const mQ = window.matchMedia?.("(pointer:coarse)");
    if (mQ?.media === "(pointer:coarse)") {
      hasTouchScreen = !!mQ.matches;
    } else if ("orientation" in window) {
      hasTouchScreen = true; // deprecated, used for fallback
    } else {
      // Only as a last resort, fallback to user agent sniffing
      const UA = (window as Window).navigator.userAgent;
      hasTouchScreen =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }

  return hasTouchScreen;
}
