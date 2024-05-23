import { Entries } from "@/types/utils";

type ValidatorFunc<T> = (value: T) => T | never;
type PickValidators<T> = T extends any ? Iterable<ValidatorFunc<T>> : never;

export function runValidators<T>(
  value: T,
  validators: PickValidators<T>,
  errorList?: string[],
): T {
  for (const validator of validators) {
    try {
      value = validator(value);
    } catch (error) {
      errorList && errorList.push((error as Error).message);
    }
  }
  return value;
}

export function callValidator<T, E extends Error = Error>(
  value: T,
  validator?: (value: T) => T,
  hasError: boolean = false,
): [boolean, T, E?] {
  if (!validator) throw new Error("Validator hasn't been passed");
  let errorObj;
  try {
    value = validator(value);
  } catch (error) {
    hasError = true;
    if (error instanceof Error) {
      errorObj = error as E;
    }
  }
  return [hasError, value, errorObj];
}

export function validateChild<T>(
  validator?: () => T,
  hasError: boolean = false,
): [boolean, T | undefined] {
  if (!validator) throw new Error("Validator hasn't been passed");
  let value;
  try {
    value = validator();
  } catch (error) {
    hasError = true;
  }
  return [hasError, value];
}

export function validateChildren<
  T extends Record<string, unknown>,
  M extends { [K in keyof T]: { validate(): T[K] | undefined | never } },
>(data: T, children: M, hasError: boolean): boolean {
  for (const [key, item] of Object.entries(children) as Entries<M>) {
    try {
      const value = item.validate();
      if (!hasError) {
        data[key as keyof T] = value as T[keyof T];
      }
    } catch (error) {
      hasError = true;
    }
  }
  return hasError;
}
