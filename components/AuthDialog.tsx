import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function AuthDialog() {
  return (
    <Dialog>
      <DialogTrigger className="flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-none transition-colors hover:bg-primary/90">
        Login
      </DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
}
