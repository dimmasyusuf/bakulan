"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { signOut } from "@/auth";
import { useState } from "react";
import { getInitials } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { logoutUser } from "@/lib/actions/auth.action";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function AuthProfile({ user }: { user?: User }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className="flex items-center justify-center"
        aria-label="Open User Profile"
      >
        <Avatar className="h-9 w-9 rounded-md">
          <AvatarImage
            src={user?.image!}
            width={36}
            height={36}
            alt={user?.name!}
          />
          <AvatarFallback className="h-9 w-9 rounded-md bg-primary text-primary-foreground">
            {getInitials(user?.name!)}
          </AvatarFallback>
        </Avatar>
        {isOpen ? (
          <ChevronDownIcon className="ml-0.5 hidden h-4 w-4 rotate-180 transition-transform duration-200 sm:flex" />
        ) : (
          <ChevronDownIcon className="ml-0.5 hidden h-4 w-4 sm:flex" />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <Avatar className="h-9 w-9 rounded-md">
            <AvatarImage
              src={user?.image!}
              width={36}
              height={36}
              alt={user?.name!}
            />
            <AvatarFallback className="h-9 w-9 rounded-md bg-primary text-primary-foreground">
              {getInitials(user?.name!)}
            </AvatarFallback>
          </Avatar>
          <div className="w-full overflow-hidden">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>

        <Separator />

        <Button size="sm" className="w-full" onClick={() => logoutUser()}>
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
