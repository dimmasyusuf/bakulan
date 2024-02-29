import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Bakulan</h1>
      <Button className="bg-primary text-primary-foreground">Click Me</Button>
    </main>
  );
}
