import Sidebar from "@/components/Sidebar";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="mx-auto max-w-screen-2xl">
        <Sidebar />
      </header>
      {children}
    </>
  );
}
