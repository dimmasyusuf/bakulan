import Navbar from "@/components/Navbar";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="p-4">
        <Navbar />
      </header>
      {children}
    </>
  );
}
