import { listClients } from "@/actions/client";
import { saveClient } from "@/actions/client";
import { InsertClient, SelectClient } from "@/db/schema";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

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

export function useClients(page = 1, pageSize = 10, name?: string) {
  const queryClient = useQueryClient();
  const queryKey = clientKeys.list({ page, pageSize, name });

  const prefetchAdjacentPages = useCallback(() => {
    if (!name) {
      if (page > 0) {
        const nextPage = page + 1;
        queryClient.prefetchQuery({
          queryKey: clientKeys.list({ page: nextPage, pageSize, name }),
          queryFn: () => listClients(nextPage, pageSize, name),
        });
      }

      if (page > 1) {
        const prevPage = page - 1;
        queryClient.prefetchQuery({
          queryKey: clientKeys.list({ page: prevPage, pageSize, name }),
          queryFn: () => listClients(prevPage, pageSize, name),
        });
      }
    }
  }, [name, page, pageSize, queryClient]);

  const query = useQuery<ClientsResponse | null, Error>({
    queryKey,
    queryFn: async () => {
      const result = await listClients(page, pageSize, name);
      return result;
    },
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (query.isSuccess) {
      prefetchAdjacentPages();
    }
  }, [query.isSuccess, page, pageSize, name, prefetchAdjacentPages]);

  return {
    ...query,
    prefetchAdjacentPages,
  };
}

export function useOptimisticClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: InsertClient }) => {
      return saveClient(data);
    },
    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: clientKeys.lists() });

      const previousClients = queryClient.getQueryData(
        clientKeys.list({ page: 1, pageSize: 10 })
      );

      queryClient.setQueryData(
        clientKeys.list({ page: 1, pageSize: 10 }),
        (old: ClientsResponse | null | undefined) => {
          if (!old) return old;

          return {
            ...old,
            clients: [data, ...(old.clients || [])].slice(
              0,
              old.clients.length
            ),
            total: (old.total || 0) + 1,
          };
        }
      );

      return { previousClients };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(
          clientKeys.list({ page: 1, pageSize: 10 }),
          context.previousClients
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}
