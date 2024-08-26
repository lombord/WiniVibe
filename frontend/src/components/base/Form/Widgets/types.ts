import type { FC, ReactNode, RefObject } from "react";
import type {
  InputProps as NextInputProps,
  TextAreaProps as NextTextAreaProps,
} from "@nextui-org/react";

import type { ValueOf } from "@/types/utils";

import type { Widgets } from "./index";
import type { AxiosRequestConfig } from "axios";
import type {
  ChildrenRenderFunc,
  InputFileResult,
  InputFilesValidator,
  InputUploadValidator,
} from "./InputFile/types";

// Widget base/inferred types
export type WidgetKeys = keyof Widgets;

export type SetterFunc<T> = React.Dispatch<React.SetStateAction<T>>;

// widget refs
export type WidgetRef<T> = RefObject<{
  validate: () => T | undefined | void | never;
}>;

export type WidgetBase<
  T = string,
  W = T,
  EX extends Record<string, unknown> = {},
> = Omit<EX, "value" | "setValue" | "widgetRef"> & {
  value?: T;
  setValue: SetterFunc<T | undefined>;
  widgetRef?: WidgetRef<W>;
};

export type WidgetPropsType = {
  [K in WidgetKeys]: Widgets[K] extends FC<infer T> ? T : unknown;
};

export type WidgetValuesMap = {
  [K in keyof WidgetPropsType]: WidgetPropsType[K] extends WidgetBase<
    infer _,
    infer W
  >
    ? W
    : never;
};

export type AwaitedWidgetValuesMap = {
  [K in keyof WidgetValuesMap]: Awaited<WidgetValuesMap[K]>;
};

export type WidgetValues = ValueOf<WidgetValuesMap>;

export type AwaitedWidgetValues = Awaited<ValueOf<WidgetValuesMap>>;

export type PickWidgetRef<T extends WidgetKeys> = T extends any
  ? WidgetRef<WidgetValuesMap[T]>
  : never;

// widgets prop types
type InputTextBase = {
  maxLength?: number;
};

export type HandleValidate<T> = (value?: T) => T | void;

export type InputProps<T = string> = WidgetBase<T, T, NextInputProps> &
  InputTextBase & {
    regexPattern?: RegExp;
    regexError?: string;
    handleValidate?: HandleValidate<T>;
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

export type InputMaskProps = InputProps & {
  mask: string;
  slotChar?: string;
  yieldMasked?: boolean;
  errorMessage?: string;
};

export type InputPhoneProps = Omit<InputMaskProps, "mask" | "slotChar">;

export type TextAreaProps = WidgetBase<string, string, InputTextBase> &
  Omit<NextTextAreaProps, "ref">;

export type InputFileProps<
  UC extends AxiosRequestConfig | null,
  M extends boolean = false,
  UT extends object = object,
> = WidgetBase<
  File[],
  Promise<
    (UC extends AxiosRequestConfig ? UT : InputFileResult<M>) | undefined | null
  >,
  Omit<JSX.IntrinsicElements["input"], "type" | "children">
> & {
  uploadConfig?: UC;
  uploadAs?: string;
  multiple?: M;
  isRequired?: boolean;
  isInvalid?: boolean;
  maxFiles?: number;
  filesValidator?: InputFilesValidator;
  uploadValidator?: InputUploadValidator;
  typeErrorMessage?: string;
  children?: ChildrenRenderFunc;
};

export type ImageUploadResult = {
  image_key: string;
  extracted_color?: string;
};

export type ImageCropSize = [number, number];

export type InputImageProps<
  U extends string = "",
  UC extends AxiosRequestConfig | null = U extends ""
    ? null
    : {
        url: U;
      },
> = Omit<
  InputFileProps<UC, false, ImageUploadResult>,
  "uploadConfig" | "uploadAs" | "multiple" | "children" | "accept"
> & {
  uploadTo?: U;
  cropSize?: ImageCropSize;
};
