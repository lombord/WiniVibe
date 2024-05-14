import { forwardRef } from "react";
import {
  type LinkProps as RouterLinkProps,
  Link as RouterLink,
} from "react-router-dom";
import {
  type LinkProps as NextLinkProps,
  useLink,
  linkAnchorClasses,
} from "@nextui-org/react";
import { LinkIcon } from "@nextui-org/shared-icons";

type LinkProps = Omit<NextLinkProps, "href"> & Pick<RouterLinkProps, "to">;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, ...props }, ref) => {
    const {
      children,
      showAnchorIcon,
      anchorIcon = <LinkIcon className={linkAnchorClasses} />,
      getLinkProps,
    } = useLink({
      ...props,
      ref,
    });

    return (
      <RouterLink {...getLinkProps()} to={to}>
        <>
          {children}
          {showAnchorIcon && anchorIcon}
        </>
      </RouterLink>
    );
  },
);

export default Link;
