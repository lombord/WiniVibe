import { OffsetPagination } from "@/types/fetch";
import { hasOwn } from "@/utils/common";
import { type ReactNode, Fragment, memo, useMemo } from "react";

type RenderFunc<T> = (item: T, i: number) => ReactNode;

interface ListPagesProps<T> {
  pages: OffsetPagination<T>[] | T[];
  children: RenderFunc<T>;
}

interface ListRenderProps<T> {
  pages: T[];
  children: RenderFunc<T>;
}

interface PagesRenderProps<T> {
  pages: OffsetPagination<T>[];
  children: RenderFunc<T>;
}

function ListRender<T>({ pages, children }: ListRenderProps<T>) {
  return <>{pages.map(children)}</>;
}

function PagesRender<T>({ pages, children }: PagesRenderProps<T>) {
  return (
    <>
      {pages.map((page, i) => (
        <Fragment key={i}>{page.results.map(children)}</Fragment>
      ))}
    </>
  );
}

function ListPages<T>({ pages, children }: ListPagesProps<T>) {
  const Component = useMemo(() => {
    return hasOwn(pages[0], "results") ? PagesRender<T> : ListRender<T>;
  }, []);

  return (
    <Component
      pages={pages as OffsetPagination<T>[] & T[]}
      children={children}
    />
  );
}

export default memo(ListPages) as typeof ListPages;
