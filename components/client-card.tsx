"use client";

import { Mail, Phone, User } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { SelectClient } from "@/db/schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useClients } from "@/hooks/useClientsQuery";
import { useEffect } from "react";

type ClientCardProps = SelectClient;

//TODO: Avoid the user to navigate to a page that does not exist.
export const ClientCard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");
  const page = pageParams ? parseInt(pageParams) : 1;
  const pageSize = 2;

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const goToPage = (pageNumber: number) => {
    router.push(
      `${pathname}?${createQueryString("page", pageNumber.toString())}`
    );
  };

  const { data, isLoading, isPending, error, prefetchAdjacentPages } =
    useClients(page, pageSize);

  useEffect(() => {
    prefetchAdjacentPages();
  }, [page, prefetchAdjacentPages]);

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

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <>
      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
            <Skeleton className="h-10 w-10 rounded-full bg-gray-500/20" />
          </div>
        )}
      </div>

      {data.clients.map((client: ClientCardProps) => (
        <div
          className="flex flex-col p-4 border border-foreground gap-y-2"
          key={client.email}
        >
          <div className="border border-background flex gap-x-4 p-2 items-center">
            <User />
            <span>{client.name}</span>
          </div>
          <div className="border border-background flex gap-x-4 p-2 items-center">
            <Mail />
            <span>{client.email}</span>
          </div>
          <div className="border border-background flex gap-x-4 p-2 items-center">
            <Phone />
            <span>{client.phone}</span>
          </div>
        </div>
      ))}

      {data.clients.length > 0 && (
        <div className="flex justify-between items-center mt-4">
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
