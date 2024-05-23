import type {
  WidgetPropsType,
  WidgetKeys,
  WidgetValuesMap,
} from "../Widgets/types";
import type { FormBaseRef } from "../types";

// ** Field types ** //
export type FieldWidget<T extends WidgetKeys> = {
  type: T;
  props: Omit<WidgetPropsType[T], "value" | "setValue">;
};

export type FieldValidator<
  T extends WidgetKeys,
  V extends WidgetValuesMap[T] = WidgetValuesMap[T],
> = (value: V) => V | never;

export type WidgetDispatchProps<T extends WidgetKeys> = Partial<
  Omit<FieldWidget<T>["props"], "defaultValue">
> & {
  widget?: T | FieldWidget<T>;
  defaultValue?: WidgetValuesMap[T];
  isInvalid?: boolean;
  resetErrors: () => void;
};

export type FieldProps<T extends WidgetKeys = "input"> = Pick<
  WidgetDispatchProps<T>,
  "widget" | "defaultValue"
> & {
  fieldKey: string;
  idPrefix?: string;
  label?: string;
  showLabel?: boolean;
  isRequired?: boolean;
  requiredMessage?: string;
  validators?: FieldValidator<T>[];
  hints?: string[];
};

export type PickField<T extends WidgetKeys> = T extends any
  ? FieldProps<T>
  : never;

export type FieldError = string | string[];

export type FieldRef<T> = FormBaseRef<T> & {
  setFieldError(error: FieldError): void;
};

// ** Fields types ** //
export type FieldsField<T extends WidgetKeys> = Omit<FieldProps<T>, "fieldKey">;

export type PickFields<T extends WidgetKeys> = T extends any
  ? FieldsField<T>
  : never;

export type Fields = Record<string, PickFields<WidgetKeys>>;

export type FieldsProps<F extends Fields> = {
  fields: F;
} & Pick<FieldProps, "idPrefix">;

export type FieldsData<T extends Fields = Fields> = {
  [K in keyof T]: T[K] extends FieldsField<infer U>
    ? T[K] extends { isRequired: false }
      ? WidgetValuesMap[U] | undefined
      : WidgetValuesMap[U]
    : {};
};

export type FieldsError<F extends Fields> = {
  [K in keyof F]?: FieldError;
};

export type FieldsRef<
  F extends Fields,
  FD extends FieldsData<F> = FieldsData<F>,
> = FormBaseRef<FD> & {
  setFieldsError(errors: FieldsError<F>): void;
};

export type ChildFieldsRef<FD extends FieldsData<Fields>> = {
  [K in keyof FD]: FieldRef<FD[K]>;
};
