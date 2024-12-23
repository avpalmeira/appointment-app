import { User } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";

interface HeaderProps {
  user: User;
  className?: string;
}

export function Header({ user, className }: HeaderProps) {
  return (
    <header className={cn("p-4", className)}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl text-gray-700">Appointment App</h1>
        <div className="flex items-center gap-4">
          <div className="text-gray-700">Welcome, {user.name}</div>
          <Button
            variant="outline"
            asChild
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Link href="/">Logout</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
