import { useEffect, useState } from "react";

type WindowSize = {
  width?: number;
  height?: number;
};

enum ScreenSize {
  mobile = 768,
}

export function getWindowSize(): WindowSize {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useWindowResizeEffect(handler: () => void) {
  useEffect(() => {
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
}

export function useIsWindowChanged(limit: number) {
  const [isChanged, setIsChanged] = useState(false);
  function handleResize() {
    setIsChanged(window.innerWidth > limit);
  }

  useWindowResizeEffect(handleResize);
  return isChanged;
}

export function useIsMobile(): boolean {
  return !useIsWindowChanged(ScreenSize.mobile);
}
