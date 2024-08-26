export function hasOwn<T>(
  target: T,
  key: string | symbol | number,
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export function hasProps<T extends {}>(obj: T): boolean {
  for (const _ in obj) {
    return true;
  }
  return false;
}

export function isEmpty<T>(obj: T): boolean {
  if (obj == null) return true;

  if (Array.isArray(obj)) {
    return !obj.length;
  }

  const objType = typeof obj;

  if (objType === "object") {
    return !hasProps(obj);
  }

  if (objType === "string") {
    return !obj;
  }

  return false;
}

export function notEmpty<T>(
  obj: T,
): obj is Exclude<T, undefined | null | void | never | ""> {
  return !isEmpty<T>(obj);
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

