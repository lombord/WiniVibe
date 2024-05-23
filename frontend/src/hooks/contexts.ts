import { createContext, useContext } from "react";
import { ThemeCtxType } from "./theme";

export const TouchContext = createContext<boolean>(false);
export const useTouchCtx = () => useContext(TouchContext);

export const ThemeContext = createContext<ThemeCtxType | null>(null);
export const useThemeCtx = (): ThemeCtxType => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("ThemeContext.Provider is not provided");
  return theme;
};
