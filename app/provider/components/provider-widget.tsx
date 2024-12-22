"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AppointmentsList } from "./appointments-list";
import { TimeSlotManager } from "./time-slot-manager";

export function ProviderWidget() {
  const [selectedTab, setSelectedTab] = useState<"appointments" | "time-slots">(
    "appointments"
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button onClick={() => setSelectedTab("time-slots")} variant="outline">
          Manage Time Slots
        </Button>
        <Button
          onClick={() => setSelectedTab("appointments")}
          variant="secondary"
          className="bg-purple-100 hover:bg-purple-200"
        >
          Manage Appointments
        </Button>
      </div>

      {selectedTab === "appointments" && <AppointmentsList />}
      {selectedTab === "time-slots" && <TimeSlotManager />}
    </div>
  );
}
