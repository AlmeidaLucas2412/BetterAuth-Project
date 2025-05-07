import { listClients } from "@/actions/client";
import { useQuery } from "@tanstack/react-query";

export function useClients(page = 1, pageSize = 10, name?: string) {
  return useQuery({
    queryKey: ["clients", page, pageSize, name],
    queryFn: async () => {
      console.log("Fetching page", page);
      const result = await listClients(page, pageSize, name);
      console.log("Cached Page", page);
      return result;
    },
  });
}
