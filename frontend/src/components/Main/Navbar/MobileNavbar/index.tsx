import NavItems from "./NavItems";
import { navItems } from "./conf";
// import NavItem from "./NavItem";

const MobileNavbar = () => {
  return (
    <>
      <NavItems items={navItems} />
    </>
  );
};

export default MobileNavbar;
