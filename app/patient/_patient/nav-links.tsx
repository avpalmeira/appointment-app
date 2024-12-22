"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  const isPatientSchedulerPage = pathname.includes("scheduler");
  const isPatientAppointmentsPage = pathname.includes("appointments");
  const selectedButtonClass = "bg-sky-100 hover:bg-sky-200";

  return (
    <div className="flex gap-4 justify-center lg:justify-start">
      <Button
        variant={isPatientSchedulerPage ? "secondary" : "outline"}
        className={isPatientSchedulerPage ? selectedButtonClass : ""}
      >
        <Link href="/patient/scheduler">Create Appointment</Link>
      </Button>
      <Button
        variant={isPatientAppointmentsPage ? "secondary" : "outline"}
        className={isPatientAppointmentsPage ? selectedButtonClass : ""}
      >
        <Link href="/patient/appointments">Manage Appointments</Link>
      </Button>
    </div>
  );
}
