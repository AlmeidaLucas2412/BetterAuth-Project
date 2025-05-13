"use client";

import { Mail, Phone, User } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { SelectClient } from "@/db/schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useClients } from "@/hooks/useClientsQuery";
import { useCallback, useEffect } from "react";

type ClientCardProps = SelectClient;

export const ClientCard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");
  const page = pageParams ? parseInt(pageParams) : 1;
  const pageSize = 2;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const goToPage = (pageNumber: number) => {
    router.push(
      `${pathname}?${createQueryString("page", pageNumber.toString())}`
    );
  };

  const { data, isLoading, isPending, error, prefetchAdjacentPages } =
    useClients(page, pageSize);

  const totalPages = Math.ceil((data?.total ?? 0) / pageSize);

  useEffect(() => {
    prefetchAdjacentPages();
  }, [page, prefetchAdjacentPages]);

  useEffect(() => {
    if (page > totalPages) {
      router.replace(`${pathname}?${createQueryString("page", "1")}`);
    }
  }, [createQueryString, page, pathname, router, totalPages]);

  if (isLoading)
    return (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-44 w-[calc(100dvw-2rem)] bg-gray-500/20 rounded-none" />
        <Skeleton className="h-44 w-[calc(100dvw-2rem)] bg-gray-500/20 rounded-none" />
      </div>
    );

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <span>Erro ao carregar os clientes. Tente novamente</span>
      </div>
    );
  }

  if (!data || !data.clients) return null;

  return (
    <>
      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <Skeleton className="w-10 h-10 rounded-full bg-gray-500/20" />
          </div>
        )}
      </div>

      {data.clients.map((client: ClientCardProps) => (
        <div
          className="flex flex-col p-4 border border-foreground gap-y-2"
          key={client.email}
        >
          <div className="flex items-center p-2 border border-background gap-x-4">
            <User />
            <span>{client.name}</span>
          </div>
          <div className="flex items-center p-2 border border-background gap-x-4">
            <Mail />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center p-2 border border-background gap-x-4">
            <Phone />
            <span>{client.phone}</span>
          </div>
        </div>
      ))}

      {data.clients.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={() => goToPage(Math.max(1, page - 1))}
            disabled={page === 1 || isPending}
          >
            Anterior
          </Button>
          <span>
            Página {page} de {totalPages || 1}
          </span>
          <Button
            onClick={() => goToPage(Math.min(totalPages || 1, page + 1))}
            disabled={page === (totalPages || 1) || isPending}
          >
            Próxima
          </Button>
        </div>
      )}
    </>
  );
};
