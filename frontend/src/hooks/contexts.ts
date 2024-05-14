import { createContext, useContext } from "react";
import { ThemeCtxType } from "./theme";

export const MobileContext = createContext<boolean>(false);
export const useMobileCtx = () => useContext(MobileContext);

export const ThemeContext = createContext<ThemeCtxType | null>(null);
export const useThemeCtx = (): ThemeCtxType => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("ThemeContext.Provider is not provided");
  return theme;
};
