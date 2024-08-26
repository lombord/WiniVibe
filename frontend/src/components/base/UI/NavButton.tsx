import { type FC } from "react";

import { Button, ButtonProps } from "@nextui-org/react";
import Link from "./Link";

const NavButton: FC<ButtonProps> = (props) => {
  return <Button as={Link} {...props} />;
};

export default NavButton;
