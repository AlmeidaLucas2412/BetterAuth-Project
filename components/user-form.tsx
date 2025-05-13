"use client";

import { saveUser } from "@/actions/user";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const UserForm = () => {
  const [data, setData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    authUserId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { success, error } = await saveUser(data);

    if (success) {
      setIsLoading(false);
      toast.success("Usuário cadastrado com sucesso!", {
        duration: 2000,
      });
      router.replace("/welcome");
    } else {
      setIsLoading(false);
      toast.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center p-6 border rounded-md gap-y-4"
    >
      <span className="text-lg font-semibold tracking-tighter">
        Complete seu cadastro
      </span>
      <input
        type="text"
        placeholder="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        className="p-4 border rounded-sm"
      />
      <input
        type="text"
        placeholder="Username"
        value={data.username}
        onChange={(e) => setData({ ...data, username: e.target.value })}
        className="p-4 border rounded-sm"
      />
      <input
        type="text"
        placeholder="Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        className="p-4 border rounded-sm"
      />
      <Button className="w-full rounded-sm" disabled={isLoading} type="submit">
        {isLoading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
};
