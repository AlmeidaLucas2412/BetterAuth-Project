"use client";

import { Button } from "@/components/ui/button";
import { Github, Loader } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";

export const SignCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSign = async () => {
    try {
      setIsLoading(true);
      await signIn();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center glassmorphism text-foreground p-6 rounded-sm shadow-lg shadow-blue-950 gap-y-4">
      <span className="text-xl font-semibold">Better Auth</span>
      <div className="flex gap-x-2 items-center">
        <Button
          className="flex gap-x-2 p-6 font-bold"
          onClick={handleSign}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="size-6 animate-spin" />
          ) : (
            <Github className="size-8" />
          )}
          Sign In with Github
        </Button>
      </div>
    </div>
  );
};
