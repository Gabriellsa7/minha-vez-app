import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const MAX_QUERY_RETRIES = 2;

const shouldRetryQuery = (failureCount: number, error: unknown) => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status && status >= 400 && status < 500) return false;
  }

  return failureCount < MAX_QUERY_RETRIES;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      retry: shouldRetryQuery,
    },
    mutations: {
      retry: false,
    },
  },
});
