import type { AxiosRequestConfig } from "axios";
import type { Fields } from "./Fields/types";
import type {
  SectionData,
  ChildSectionProps,
  SectionsMap,
  SectionProps,
} from "./Sections/types";

export type FormBaseRef<T> = {
  validate: () => T | undefined | never;
};

export type FormProps<
  F extends Fields = Fields,
  S extends SectionsMap = SectionsMap,
  SD extends SectionData<F, S> = SectionData<F, S>,
> = {
  title?: string;
  submitTitle?: string;
  config?: ((data: SD) => Promise<any>) | Omit<AxiosRequestConfig, "data">;
  succeed?: (data: any) => void;
  validated?: (data: SD) => void;

  structure: SectionProps<F, S>;
};

export { ChildSectionProps as SectionProps };
