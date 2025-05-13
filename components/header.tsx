"use client";

import { getSession, signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Loader, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Header = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState("");

  const AVATAR_FALLBACK = name.charAt(0).toUpperCase();

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
    <header className="flex items-center justify-between p-4 bg-transparent">
      <div className="flex items-center p-2 rounded-md gap-x-2 hover:bg-foreground hover:text-background">
        <Avatar className="size-10">
          <AvatarImage src={imageUrl || ""} alt="Profile picture" />
          <AvatarFallback>
            <span className="font-semibold text-gray-600">
              {AVATAR_FALLBACK}
            </span>
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold text-nowrap">{name}</span>
      </div>
      <Button
        onClick={handleSignOut}
        className="flex p-6 gap-x-2"
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
