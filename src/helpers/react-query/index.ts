import type {
  InfiniteData,
  QueryClient,
  UndefinedInitialDataInfiniteOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const invalidateQueryKeys = (
  queryClient: QueryClient,
  queryKeys: readonly string[],
) =>
  Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey: [queryKey] }),
    ),
  );

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
  invalidates: readonly string[] = [],
) => {
  return (
    options?: Omit<
      UseMutationOptions<TReturnData, Error, TFilter>,
      "mutationKey" | "mutationFn"
    >,
  ) => {
    const queryClient = useQueryClient();

    return useMutation<TReturnData, Error, TFilter>({
      ...options,
      mutationKey: [queryKey],
      mutationFn: (event: TFilter) => fn(event) as Promise<TReturnData>,
      onSuccess: (...args) => {
        void invalidateQueryKeys(queryClient, invalidates);
        return options?.onSuccess?.(...args);
      },
    });
  };
};

export const generateReactQueryInfinityScroll = <
  TReturnData = void,
  TFilter = void,
  TReactQueryPageParam = unknown,
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
      UndefinedInitialDataInfiniteOptions<
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
