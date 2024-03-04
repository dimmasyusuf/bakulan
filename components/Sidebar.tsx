import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function Sidebar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <h1 className="">Bakulan</h1>

      <div className="flex items-center rounded-md border pr-3">
        <Input
          type="text"
          placeholder="Search"
          className="border-none shadow-none"
        />
        <MagnifyingGlassIcon className="h-6 w-6" />
      </div>

      <div className="flex items-center gap-8">
        <ul className="flex gap-4">
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            <Link href="/dashboard">Menu</Link>
          </li>
          <li>
            <Link href="/dashboard">Orders</Link>
          </li>
        </ul>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
