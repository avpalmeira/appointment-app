import { AppointmentScheduler } from "./appointment-scheduler";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppointmentWidget() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center lg:justify-start">
        <Button asChild variant="secondary">
          <Link href="/appointments/new">Create Appointment</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/appointments">Manage Appointments</Link>
        </Button>
      </div>

      <AppointmentScheduler />
    </div>
  );
}
