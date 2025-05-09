"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { saveClient } from "@/actions/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { useOptimisticClientMutation } from "@/hooks/useClientsQuery";

type Props = {
  userId: string;
};

export const ClientForm = ({ userId }: Props) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    userId: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useOptimisticClientMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.phone) return;

    try {
      const clientData = {
        ...data,
        userId,
      };

      mutation.mutate({
        data: clientData,
      });

      const result = await saveClient(clientData);

      if (result.success) {
        setData({ name: "", email: "", phone: "", userId: "" });
        setIsOpen(false);
      } else {
        console.error("Falha ao adicionar o cliente", result.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setData({ name: "", email: "", phone: "", userId: "" });
          }
        }}
      >
        <DialogContent className="w-[calc(100%-4rem)]">
          <DialogHeader>
            <DialogTitle>Adicionar Cliente</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-4 rounded-md"
          >
            <input
              type="text"
              placeholder="Nome"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="p-4 border rounded-sm"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="p-4 border rounded-sm"
              required
            />
            <input
              type="tel"
              placeholder="Celular"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="p-4 border rounded-sm"
              required
            />
            <Button
              type="submit"
              className="rounded-sm p-6"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Button
        onClick={() => setIsOpen(true)}
        className="uppercase font-semibold flex gap-x-1 self-start"
      >
        Adicionar Cliente
        <Plus />
      </Button>
    </>
  );
};
