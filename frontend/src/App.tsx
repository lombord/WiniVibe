import "./App.css";

import { MobileContext, ThemeContext } from "./hooks/contexts";
import { useIsMobile } from "./hooks/window";
import { useTheme } from "./hooks/theme";
import Entrypoint from "@/components/Main/Entrypoint";

function App() {
  const isMobile = useIsMobile();
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>
      <MobileContext.Provider value={isMobile}>
        <Entrypoint />
      </MobileContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
