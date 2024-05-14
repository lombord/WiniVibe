import { useMobileCtx } from "@/hooks/contexts";
import DeskNavbar from "./DeskNavbar";
import MobileNavbar from "./MobileNavbar";

const Sidebar = () => {
  const isMobile = useMobileCtx();

  return <>{isMobile ? <MobileNavbar /> : <DeskNavbar />}</>;
};

export default Sidebar;
