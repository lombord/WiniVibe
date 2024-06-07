export type OffsetPagination<T> = {
  count: number;
  next?: string;
  previous?: string;
  results: T extends any[] ? T : T[];
};

export type PagesPossible<T> = OffsetPagination<T>[] | T[];
