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

  const handleSubmit = async () => {
    setIsLoading(true);

    await saveClient({ ...data, userId }).finally(() => {
      setIsLoading(false);
      location.reload();
    });
  };

  return (
    <>
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Cliente</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <form className="flex flex-col gap-y-4 border p-6 rounded-md items-center">
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
          className="w-full rounded-sm"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </>
  );
};
