"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AppointmentsList } from "./appointments-list";
import { AppointmentScheduler } from "./appointment-scheduler";

export function AppointmentWidget() {
  const [selectedTab, setSelectedTab] = useState<"new" | "manage">("new");

  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center lg:justify-start">
        <Button
          onClick={() => setSelectedTab("new")}
          variant="secondary"
          className="bg-sky-100 hover:bg-sky-200"
        >
          Create Appointment
        </Button>
        <Button onClick={() => setSelectedTab("manage")} variant="outline">
          Manage Appointments
        </Button>
      </div>

      {selectedTab === "new" && <AppointmentScheduler />}
      {selectedTab === "manage" && <AppointmentsList />}
    </div>
  );
}
