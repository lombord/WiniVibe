import "./App.css";

import { MobileContext, ThemeContext } from "./hooks/contexts";
import { useIsMobile } from "./hooks/window";
import { useTheme } from "./hooks/theme";
import Entrypoint from "@Main/Entrypoint";
import Toast from "@Core/Toast";

function App() {
  const isMobile = useIsMobile();
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>
      <MobileContext.Provider value={isMobile}>
        <Entrypoint />
        <Toast />
      </MobileContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
