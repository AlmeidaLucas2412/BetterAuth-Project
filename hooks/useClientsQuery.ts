import { listClients } from "@/actions/client";
import { saveClient } from "@/actions/client";
import { InsertClient, SelectClient } from "@/db/schema";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// Client query keys creator for consistent cache references
export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (filters: { page: number; pageSize: number; name?: string }) =>
    [...clientKeys.lists(), filters] as const,
  details: () => [...clientKeys.all, "detail"] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

interface ClientsResponse {
  clients: SelectClient[];
  total: number;
  cacheKey?: string;
}

// Main clients query hook with prefetching for adjacent pages
export function useClients(page = 1, pageSize = 10, name?: string) {
  const queryClient = useQueryClient();
  const queryKey = clientKeys.list({ page, pageSize, name });

  // Prefetch adjacent pages
  const prefetchAdjacentPages = () => {
    // Only prefetch next page if we're not searching
    if (!name && page > 0) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: clientKeys.list({ page: nextPage, pageSize, name }),
        queryFn: () => listClients(nextPage, pageSize, name),
      });
    }
  };

  const query = useQuery<ClientsResponse | null, Error>({
    queryKey,
    queryFn: async () => {
      const result = await listClients(page, pageSize, name);
      return result;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Call prefetchAdjacentPages when query is successful
  if (query.isSuccess) {
    prefetchAdjacentPages();
  }

  return {
    ...query,
    prefetchAdjacentPages,
  };
}

// Optimistic update helper for client mutations
export function useOptimisticClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: InsertClient }) => {
      // This calls the server action to save the client
      return saveClient(data);
    },
    onMutate: async ({ data }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: clientKeys.lists() });

      // Snapshot the previous value
      const previousClients = queryClient.getQueryData(clientKeys.lists());

      // Optimistically update the cache
      queryClient.setQueryData(
        clientKeys.list({ page: 1, pageSize: 10 }),
        (old: ClientsResponse | null | undefined) => {
          if (!old) return old;

          return {
            ...old,
            clients: [data, ...(old.clients || [])],
            total: (old.total || 0) + 1,
          };
        }
      );

      return { previousClients };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, restore from snapshot
      if (context?.previousClients) {
        queryClient.setQueryData(clientKeys.lists(), context.previousClients);
      }
      // toaster to show error
    },
    onSettled: () => {
      // Always refetch after error or success to make sure cache is in sync
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}
