import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="mx-auto flex max-w-screen-2xl items-center justify-between">
      <Link href="/" className="cursor-pointer">
        <Image src="/logo.svg" alt="Bakulan Logo" width={40} height={40} />
      </Link>

      <ul className="flex w-fit">
        <li>
          <Button variant="ghost" asChild>
            <Link href="/">Dashboard</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild>
            <Link href="/menu">Menu</Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" asChild>
            <Link href="/orders">Orders</Link>
          </Button>
        </li>
      </ul>

      <div className="flex items-center gap-8">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
