"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/types";
import { useState } from "react";
import { DeleteAppointmentModal } from "@/components/delete-appointment-modal";

interface AppointmentsListProps {
  appointments: Appointment[];
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const handleDelete = () => {
    if (selectedAppointment) {
      console.log("Deleting appointment:", selectedAppointment.id);
      // Here you would typically call an API to delete the appointment
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Your next appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {appointments.map((appointment) => {
            const date = new Date(appointment.timeSlot.date).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            return (
              <div key={appointment.id}>
                <div className="text-lg font-medium border-b pb-2">{date}</div>
                <div className="flex items-center justify-between py-4">
                  <div className="text-gray-700">Doc. Stephen Z.</div>
                  <div className="text-gray-600">
                    {appointment.timeSlot.startTime} -{" "}
                    {appointment.timeSlot.endTime}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      console.log("Cancel appointment:", appointment.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel appointment</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      {selectedAppointment && (
        <DeleteAppointmentModal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onConfirm={handleDelete}
          appointment={selectedAppointment}
          patientName="Joseph M."
        />
      )}
    </>
  );
}
