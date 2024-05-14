import { useEffect, useRef, useState } from "react";

export enum Theme {
  dark = "dark",
  light = "light",
}
export const DEFAULT_THEME = Theme.dark;
export const THEME_KEY = "theme";

export type ThemeCtxType = {
  theme: Theme;
  toggleTheme: () => void;
};

export function useTheme(): ThemeCtxType {
  const [theme, setTheme] = useState(
    (localStorage.getItem(THEME_KEY) as Theme) || DEFAULT_THEME
  );
  const htmlElmClass = useRef(document.documentElement.classList);

  useEffect(() => {
    const [classList, newTheme] = [htmlElmClass.current, theme];
    localStorage.setItem(THEME_KEY, newTheme);
    classList.add(newTheme);
    return () => classList.remove(newTheme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme == Theme.dark ? Theme.light : Theme.dark);
  return { theme, toggleTheme };
}
