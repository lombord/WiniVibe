import type { FC, RefObject } from "react";
import type {
  InputProps as NextInputProps,
  TextAreaProps as NextTextAreaProps,
} from "@nextui-org/react";

import type { FormBaseRef } from "../types";
import type { ValueOf } from "@/types/utils";

import { WidgetsMap } from "./index";

// Widget base/inferred types
export interface WidgetBase<T = string> {
  value?: T;
  setValue(value?: T): void;
  widgetRef?: RefObject<WidgetRef<T> | undefined>;
}

export type Widgets = typeof WidgetsMap;
export type WidgetKeys = keyof Widgets;

export type WidgetPropsType = {
  [K in WidgetKeys]: Widgets[K] extends FC<infer T> ? T : unknown;
};

export type WidgetValuesMap = {
  [K in keyof WidgetPropsType]: WidgetPropsType[K] extends WidgetBase<infer T>
    ? T
    : string;
};

export type WidgetValues = ValueOf<WidgetValuesMap>;

// widget refs
export type WidgetRef<T> = FormBaseRef<T>;

export type PickWidgetRef<T extends WidgetKeys> = T extends any
  ? RefObject<WidgetRef<WidgetValuesMap[T]>>
  : never;

// widgets prop types
type InputTextBase = WidgetBase<string> & {
  maxLength?: number;
};

export type InputProps = Omit<NextInputProps, "ref"> &
  InputTextBase & {
    regexPattern?: RegExp;
    regexError?: string;
  };

export type NoRegexInputProps = Omit<
  InputProps,
  "type" | "regexPattern" | "regexError"
> & {
  errorMessage?: string;
};

export type EmailProps = NoRegexInputProps;

export type PasswordProps = NoRegexInputProps & {
  newPassword?: boolean;
};

export type TextAreaProps = InputTextBase & Omit<NextTextAreaProps, "ref">;
