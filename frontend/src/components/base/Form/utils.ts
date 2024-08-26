import type { Entries, ValueOf } from "@/types/utils";
import { isEmpty } from "@/utils/common";
import { FormBaseRef } from "./types";

type ValidatorFunc<T> = (value: T) => T | never;
type PickValidators<T> = T extends any ? Iterable<ValidatorFunc<T>> : never;

type ValidatorData = Record<string, unknown>;

type ValidatorsRecord<T extends ValidatorData> = {
  [K in keyof T]: FormBaseRef<T[K]>;
};

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
) {
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
  return [hasError, value, errorObj] as const;
}

export async function validateChild<T>(
  validator?: () => T,
  hasError: boolean = false,
): Promise<[boolean, Awaited<T> | undefined]> {
  if (!validator) throw new Error("Validator hasn't been passed");
  let value;
  try {
    value = await validator();
  } catch (error) {
    hasError = true;
  }
  return [hasError, value];
}

export async function validateChildren<
  T extends ValidatorData,
  M extends ValidatorsRecord<T>,
>(data: T, children: M, hasError: boolean): Promise<boolean> {
  const promises = (Object.entries(children) as Entries<M>).map(
    async ([key, item]) => {
      try {
        const value = await item.validate();
        if (!(hasError || isEmpty(value))) {
          data[key as keyof T] = value as ValueOf<T>;
        }
      } catch (error) {
        hasError = true;
      }
    },
  );
  await Promise.all(promises);
  return hasError;
}
