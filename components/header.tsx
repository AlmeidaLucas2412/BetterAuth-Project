/* eslint-disable @next/next/no-img-element */
"use client";

import { getSession, signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Loader, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    getSession().then((res) => {
      if (!res || !res.data) return;
      setImageUrl(res.data.user.image || "");
      setName(res.data.user.name || "");
    });
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      router.push("/");
    }
  };
  return (
    <header className="flex justify-between bg-transparent p-4 items-center">
      <div className="flex items-center gap-x-2 p-2 rounded-md hover:bg-foreground hover:text-background">
        <div className="flex size-10">
          <img
            src={imageUrl}
            alt="Profile Picture"
            className="object-cover rounded-full"
          />
        </div>
        <span className="font-semibold text-nowrap">{name}</span>
      </div>
      <Button
        onClick={handleSignOut}
        className="flex gap-x-2 p-6"
        disabled={isLoading}
        variant="ghost"
      >
        {isLoading ? (
          <>
            <Loader className="size-6 animate-spin" />
            <span>Saindo</span>
          </>
        ) : (
          <>
            <LogOut className="size-8" />
            <span>Sair</span>
          </>
        )}
      </Button>
    </header>
  );
};
