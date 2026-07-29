import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

export function useSupabaseQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T>({
    queryKey,
    queryFn,
    ...options,
  })
}
