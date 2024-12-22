"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  const isProviderAppointmentsPage = pathname.includes("appointments");
  const isProviderTimeSlotsPage = pathname.includes("time-slots");
  const selectedButtonClass = "bg-purple-100 hover:bg-purple-200";

  return (
    <div className="flex gap-4">
      <Button
        variant={isProviderTimeSlotsPage ? "secondary" : "outline"}
        className={isProviderTimeSlotsPage ? selectedButtonClass : ""}
      >
        <Link href="/provider/time-slots">Manage Time Slots</Link>
      </Button>
      <Button
        variant={isProviderAppointmentsPage ? "secondary" : "outline"}
        className={isProviderAppointmentsPage ? selectedButtonClass : ""}
      >
        <Link href="/provider/appointments">Manage Appointments</Link>
      </Button>
    </div>
  );
}
