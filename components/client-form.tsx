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

type Props = {
  userId: string;
};

export const ClientForm = ({ userId }: Props) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    await saveClient({ ...data, userId }).finally(() => {
      setIsLoading(false);
      location.reload();
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="w-[calc(100%-4rem)]">
          <DialogHeader>
            <DialogTitle>Adicionar Cliente</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-y-4 rounded-md">
            <input
              type="text"
              placeholder="Name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="p-4 border rounded-sm"
            />
            <input
              type="text"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="p-4 border rounded-sm"
            />
            <input
              type="text"
              placeholder="Phone"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="p-4 border rounded-sm"
            />
            <Button
              className="rounded-sm p-6"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Button
        onClick={() => setIsOpen(true)}
        className="uppercase font-semibold flex gap-x-1"
      >
        Adicionar Cliente
        <Plus />
      </Button>
    </>
  );
};
