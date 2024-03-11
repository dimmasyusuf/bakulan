"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthForm from "@/components/AuthForm";

export default function AuthDialog({ type }: { type: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-none transition-colors hover:bg-primary/90">
        Login
      </DialogTrigger>
      <DialogContent className="flex h-[100dvh] w-full items-center justify-center overflow-auto p-0 sm:h-fit sm:w-fit">
        <AuthForm type={type} openAuth={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
