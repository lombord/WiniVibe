import type {
  CommonFieldProps,
  EmptyFields,
  FieldError,
  Fields,
  FieldsData,
  FieldsError,
} from "../Fields/types";
import type { FormBaseRef } from "../types";

export type ChildSectionProps<
  F extends Fields = Fields,
  N extends SectionsMap = SectionsMap,
> = Omit<SectionProps<F, N>, "sectionKey">;

export type SectionsMap = {
  [K in string]: ChildSectionProps;
};

export type EmptyNested<N extends SectionsMap | void = void> =
  N extends SectionsMap
    ? { [K in keyof N]: EmptySection<N[K]["fields"], N[K]["nested"]> } extends {
        [K in keyof N]: true;
      }
      ? true
      : false
    : true;

export type EmptySection<
  F extends Fields | void = void,
  N extends SectionsMap | void = void,
> = F extends EmptyFields | void ? EmptyNested<N> : false;

export type SectionData<
  F extends Fields | void = Fields,
  N extends SectionsMap | void = SectionsMap,
> = (F extends Fields ? FieldsData<F> : {}) &
  (N extends SectionsMap ? SectionsData<N> : {});

export type BaseSectionsData<S extends SectionsMap = SectionsMap> = {
  [K in keyof S]: SectionData<S[K]["fields"], S[K]["nested"]>;
};

export type SectionsData<
  S extends SectionsMap = SectionsMap,
  SD extends BaseSectionsData<S> = BaseSectionsData<S>,
  UK extends keyof S & keyof SD = keyof S & keyof SD,
> = {
  [K in UK as EmptySection<S[K]["fields"], S[K]["nested"]> extends true
    ? never
    : K]: SD[K];
} & {
  [K in UK as EmptySection<S[K]["fields"], S[K]["nested"]> extends true
    ? K
    : never]?: SD[K];
};

export type SectionValidator<T> = (value: T) => T | never;

export type SectionProps<
  F extends Fields = any,
  N extends SectionsMap = any,
> = {
  sectionKey?: string;
  label?: string;
  showLabel?: boolean;
  commonFieldProps?: CommonFieldProps;
  fields?: F;
  validator?: SectionValidator<SectionData<F, N>>;
  nested?: N;
};

export type SectionsErrors<S extends SectionsMap> = {
  [K in keyof S]?: SectionErrors<S[K]>;
};

export type SectionErrors<
  S extends SectionProps | ChildSectionProps,
  F extends S["fields"] = S["fields"],
  N extends S["nested"] = S["nested"],
> =
  | ((F extends Fields ? FieldsError<F> : {}) &
      (N extends SectionsMap ? SectionsErrors<N> : {}))
  | {
      [x in string]?: FieldError;
    };

export type NonFieldErrors = Record<string, FieldError>;

export type SectionRef<
  S extends SectionProps | ChildSectionProps,
  SD extends SectionData<S["fields"], S["nested"]> = SectionData<
    S["fields"],
    S["nested"]
  >,
> = FormBaseRef<SD> & {
  setErrors(errors: SectionErrors<S>): void;
};

export type SectionsProps<
  S extends SectionsMap = SectionsMap,
  SD extends SectionsData<S> = SectionsData<S>,
> = {
  sections: S;
  inheritedProps?: Partial<SectionProps>;
  validator?: SectionValidator<SD>;
};

export type SectionsRef<
  S extends SectionsMap,
  SD extends SectionsData<S> = SectionsData<S>,
> = FormBaseRef<SD> & {
  setErrors(errors: SectionsErrors<S>): void;
};

export type ChildSectionsRef<T extends SectionsMap> = {
  [K in keyof T]: SectionRef<T[K]>;
};
