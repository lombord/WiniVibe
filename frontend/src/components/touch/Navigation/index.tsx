import NavItems from "./NavItems";
import { navItems } from "./conf";

const MobileNavbar = () => {
  return (
    <>
      <NavItems items={navItems} />
    </>
  );
};

export default MobileNavbar;
