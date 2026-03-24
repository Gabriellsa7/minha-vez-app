import type {
  DefinedInitialDataInfiniteOptions,
  InfiniteData,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const generateReactQuery = <TReturnData, TFilter>(
  queryKey: string,
  fn: (filter: TFilter) => Promise<TReturnData>,
) => {
  return (
    params: TFilter,
    options?: Omit<
      UseQueryOptions<TReturnData, Error, TReturnData, [string, TFilter]>,
      "queryKey" | "queryFn"
    >,
  ) => {
    return useQuery<TReturnData, Error, TReturnData, [string, TFilter]>({
      ...options,
      queryKey: [queryKey, params],
      queryFn: () => fn(params),
    });
  };
};

export const generateReactQueryMutation = <TReturnData = void, TFilter = void>(
  queryKey: string,
  fn: (filter: TFilter) => Promise<TReturnData> | void,
) => {
  return (
    options?: Omit<
      UseMutationOptions<TReturnData, Error, TFilter>,
      "mutationKey" | "mutationFn"
    >,
  ) => {
    return useMutation<TReturnData, Error, TFilter>({
      ...options,
      mutationKey: [queryKey],
      mutationFn: (event: TFilter) => fn(event) as Promise<TReturnData>,
    });
  };
};

export const generateReactQueryInfinityScroll = <
  TReturnData = void,
  TFilter = void,
  TReactQueryPageParam = any,
>(
  queryKey: string,
  fn: (
    filter: TFilter,
    reactQueryPageParam: TReactQueryPageParam,
  ) => Promise<TReturnData>,
) => {
  return (
    params: TFilter,
    options?: Omit<
      DefinedInitialDataInfiniteOptions<
        TReturnData,
        Error,
        InfiniteData<TReturnData>,
        [string, TFilter]
      >,
      "queryKey" | "queryFn"
    >,
  ) => {
    return useInfiniteQuery<
      TReturnData,
      Error,
      InfiniteData<TReturnData>,
      [string, TFilter]
    >({
      initialPageParam: undefined,
      getNextPageParam: () => null,
      ...options,
      queryKey: [queryKey, params],
      queryFn: ({ pageParam }) => {
        const normalizedPageParam: TReactQueryPageParam =
          pageParam as TReactQueryPageParam;
        return fn(params, normalizedPageParam);
      },
    });
  };
};
