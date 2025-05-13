"use client";

import { Button } from "@/components/ui/button";
import { Github, Loader } from "lucide-react";
import { customSignIn } from "@/lib/auth-client";
import { useState } from "react";

export const SignCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSign = async () => {
    try {
      setIsLoading(true);
      await customSignIn();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-sm text-foreground custom-shadow gap-y-4">
      <span className="text-xl font-light tracking-widest uppercase">
        Better Auth
      </span>
      <div className="flex items-center gap-x-2">
        <Button
          className="flex p-6 font-light transition-colors duration-300 bg-transparent border gap-x-2 text-foreground hover:bg-foreground hover:text-background"
          onClick={handleSign}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="size-6 animate-spin" strokeWidth={1} />
          ) : (
            <Github className="size-8" strokeWidth={1} />
          )}
          Sign In with Github
        </Button>
      </div>
    </div>
  );
};
