import { SessionUser } from "@/types/user";
import { NavLinkProps } from "react-router-dom";

export interface SectionLinkProps extends NavLinkProps {
  label?: string;
  icon: JSX.Element;
}

type showFunction = (user: SessionUser | null) => boolean;

export interface SectionProps {
  show?: boolean | showFunction;
  links: Record<string, SectionLinkProps>;
}

export interface SectionsProps {
  sections: Record<string, SectionProps>;
}
