export type ValueOf<T> = T[keyof T];

export type PromiseOrValue<T> = Promise<T> | T;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireExcept<
  T,
  Keys extends keyof unknown | keyof T = keyof unknown,
> = {
  [K in Exclude<keyof T, Keys>]-?: Exclude<T[K], undefined | null>;
} & {
  [K in Keys]+?: K extends keyof T ? T[K] : never;
};

export type DistributiveOmit<T, K extends keyof T = keyof T> = T extends any
  ? Omit<T, K>
  : never;

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
