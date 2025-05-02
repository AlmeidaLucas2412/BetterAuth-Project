"use client";

import { saveUser } from "@/actions/user";
import { useState } from "react";
import { Button } from "./ui/button";

export const UserForm = () => {
  const [data, setData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    authUserId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    await saveUser(data).finally(() => {
      setIsLoading(false);
      location.reload();
    });
  };

  return (
    <form className="flex flex-col gap-y-4 border p-6 rounded-md items-center">
      <span className="font-semibold tracking-tighter text-lg">
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
      <Button
        className="w-full rounded-sm"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
};
