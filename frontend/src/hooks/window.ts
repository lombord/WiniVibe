import { useEffect, useState } from "react";

type WindowSize = {
  width?: number;
  height?: number;
};

export function getWindowSize(): WindowSize {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useWindowResize(handler: () => void) {
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

  useWindowResize(handleResize);
  return isChanged;
}
