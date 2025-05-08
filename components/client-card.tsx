"use client";

import { Mail, Phone, User } from "lucide-react";
import { useClients } from "@/hooks/useClientsQuery";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { SelectClient } from "@/db/schema";

type ClientCardProps = SelectClient;

export const ClientCard = () => {
  const [page, setPage] = useState(1);
  const pageSize = 2;

  // Use the enhanced client query hook with prefetching
  const { data, isLoading, isPending, error, prefetchAdjacentPages } =
    useClients(page, pageSize);

  // Trigger prefetching when component mounts and when page changes
  useEffect(() => {
    prefetchAdjacentPages();
  }, [page, prefetchAdjacentPages]);

  // Different skeleton states for initial load vs. pagination
  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-44 w-[calc(100dvw-2rem)] bg-gray-500/20 rounded-none" />
        <Skeleton className="h-44 w-[calc(100dvw-2rem)] bg-gray-500/20 rounded-none" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading clients. Please try again.
      </div>
    );
  }

  if (!data || !data.clients) return null;

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <>
      {/* Semi-transparent overlay when fetching next page data */}
      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
            <Skeleton className="h-10 w-10 rounded-full bg-gray-500/20" />
          </div>
        )}

        {data.clients.map((client: ClientCardProps) => (
          <div
            className="flex flex-col p-4 border border-foreground gap-y-2 mb-4"
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
            {client.createdAt && (
              <small className="text-xs text-gray-500 self-end">
                Added: {new Date(client.createdAt).toLocaleDateString()}
              </small>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPage((page) => Math.max(1, page - 1))}
          disabled={page === 1 || isPending}
        >
          Anterior
        </Button>
        <span>
          Página {page} de {totalPages || 1}
        </span>
        <Button
          onClick={() => {
            const nextPage = Math.min(totalPages || 1, page + 1);
            setPage(nextPage);
          }}
          disabled={page === (totalPages || 1) || isPending}
        >
          Próxima
        </Button>
      </div>
    </>
  );
};
