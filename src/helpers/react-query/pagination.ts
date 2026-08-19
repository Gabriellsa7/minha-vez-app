import type { InfiniteData } from "@tanstack/react-query";

import { IPaginatedResponse } from "../../types/pagination.types";
import { generateReactQueryInfinityScroll } from "./index";

export const generatePaginatedInfiniteQuery = <TItem, TFilter>(
  queryKey: string,
  fn: (filter: TFilter, page: number) => Promise<IPaginatedResponse<TItem>>,
) => {
  const useBase = generateReactQueryInfinityScroll<
    IPaginatedResponse<TItem>,
    TFilter,
    number
  >(queryKey, (filter, page) => fn(filter, page ?? 1));

  return (params: TFilter, options?: Parameters<typeof useBase>[1]) =>
    useBase(params, {
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      ...options,
    });
};

export const flattenPaginatedPages = <TItem>(
  data?: InfiniteData<IPaginatedResponse<TItem>>,
): TItem[] => data?.pages.flatMap((page) => page.data) ?? [];
