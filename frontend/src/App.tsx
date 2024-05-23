import "./App.css";

import { TouchContext, ThemeContext } from "./hooks/contexts";
import { useTheme } from "./hooks/theme";
import Entrypoint from "@Common/Entrypoint";
import Toast from "@Base/Toast";
import useDeviceStore from "./stores/deviceStore";

function App() {
  const isTouch = useDeviceStore((state) => state.isTouch());
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>
      <TouchContext.Provider value={isTouch}>
        <Entrypoint />
        <Toast />
      </TouchContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
