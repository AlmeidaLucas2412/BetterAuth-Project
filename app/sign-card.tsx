"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export const SignCard = () => {
  const handleSign = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center glassmorphism text-foreground h-[25vh] w-[15%] rounded-sm shadow-lg shadow-blue-950 gap-y-4">
      <span className="text-xl font-semibold">Better Auth</span>
      <div className="flex gap-x-2 items-center">
        <Button className="flex gap-x-2 p-6 font-bold" onClick={handleSign}>
          <Github className="size-8" />
          Sign In with Github
        </Button>
      </div>
    </div>
  );
};
