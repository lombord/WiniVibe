export type OffsetPagination<T> = {
  count: number;
  next?: string;
  previous?: string;
  results: T extends Array<any> ? T : T[];
};
