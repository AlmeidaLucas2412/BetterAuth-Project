"use client";

import { Mail, Phone, User } from "lucide-react";
import { useClients } from "@/hooks/useClientsQuery";
import { useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type ClientCardProps = {
  name: string;
  email: string;
  phone: string;
};

export const ClientCard = () => {
  const [page, setPage] = useState(1);
  const pageSize = 2;

  const { data, isLoading } = useClients(page, pageSize);

  if (isLoading)
    return (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-44 w-[calc(100dvw-2rem)] bg-gray-500/20 rounded-none" />
        <Skeleton className="h-44 w-[calc(100dvw-2rem)] bg-gray-500/20 rounded-none" />
      </div>
    );
  if (!data) return null;

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <>
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
            onClick={() => setPage((page) => Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span>
            Página {page} de {totalPages}
          </span>
          <Button
            onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </>
  );
};
