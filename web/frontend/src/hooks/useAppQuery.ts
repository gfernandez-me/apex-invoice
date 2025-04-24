import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";

/**
 * A hook for querying your custom app data.
 * @desc A thin wrapper around useAuthenticatedFetch and react-query's useQuery.
 *
 * @param {Object} options - The options for your query. Accepts 3 keys:
 *
 * 1. url: The URL to query. E.g: /api/widgets/1`
 * 2. fetchInit: The init options for fetch.  See: https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
 * 3. reactQueryOptions: The options for `useQuery`. See: https://react-query.tanstack.com/reference/useQuery
 *
 * @returns Return value of useQuery.  See: https://react-query.tanstack.com/reference/useQuery.
 */
export const useAppQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
>({
  url,
  fetchInit = {},
  reactQueryOptions,
}: {
  url: RequestInfo;
  fetchInit?: RequestInit;
  reactQueryOptions: Omit<
    UseQueryOptions<TQueryFnData, TError, TData>,
    "queryKey" | "queryFn" | "initialData"
  > & {
    initialData?: () => undefined;
  };
}) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const fetch = useMemo(() => {
    return async () => {
      const response = await authenticatedFetch(url, fetchInit);
      return response.json();
    };
  }, [authenticatedFetch, fetchInit, url]);

  return useQuery<TQueryFnData, TError, TData>({
    queryKey: [url],
    queryFn: fetch,
    ...reactQueryOptions,
    refetchOnWindowFocus: false,
  });
};
