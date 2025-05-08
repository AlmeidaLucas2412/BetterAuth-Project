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
import { Plus, Loader2 } from "lucide-react";
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

  // Use our optimistic update mutation
  const mutation = useOptimisticClientMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.phone) {
      // toaster to show validation error
      return;
    }

    try {
      // Set the user ID from props
      const clientData = {
        ...data,
        userId,
        // Add timestamps for better cache management
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Start optimistic update
      mutation.mutate({
        data: clientData,
      });

      // Make the actual server call
      const result = await saveClient(clientData);

      if (result.success) {
        // Reset form and close dialog on success
        setData({ name: "", email: "", phone: "", userId: "" });
        setIsOpen(false);
        // toaster to show success
      } else {
        // toaster to show error
        console.error("Failed to save client:", result.error);
      }
    } catch (error) {
      console.error(error);
      // toaster to show error
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          // Reset form when dialog closes
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
              placeholder="Name"
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
              placeholder="Phone"
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
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar"
              )}
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
