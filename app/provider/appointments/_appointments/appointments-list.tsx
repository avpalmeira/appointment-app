"use client";

import { useState } from "react";
import { Info, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteAppointmentModal } from "@/components/delete-appointment-modal";
import { ExtendedAppointment, TimeSlot } from "@/types";
import { RescheduleAppointmentModal } from "./reschedule-appointment-modal";
import { deleteAppointment, rescheduleAppointment } from "@/lib/actions";

interface AppointmentsListProps {
  appointments: ExtendedAppointment[];
  timeSlots: Record<string, TimeSlot[]>;
}

export function AppointmentsList({
  appointments,
  timeSlots,
}: AppointmentsListProps) {
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<ExtendedAppointment | null>(null);
  const [appointmentToReschedule, setAppointmentToReschedule] =
    useState<ExtendedAppointment | null>(null);

  const handleDelete = () => {
    if (appointmentToDelete) {
      deleteAppointment(appointmentToDelete.id, "provider");
      setAppointmentToDelete(null);
    }
  };

  const handleReschedule = (
    appointment: ExtendedAppointment,
    newTimeSlot: TimeSlot
  ) => {
    if (appointmentToReschedule) {
      rescheduleAppointment({
        appointment: appointment.id,
        new_time_slot: newTimeSlot.id,
      });
      setAppointmentToReschedule(null);
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
            const date = appointment.timeSlot.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div key={appointment.id}>
                <div className="text-lg font-medium border-b pb-2">{date}</div>
                <div className="flex items-center justify-between py-4">
                  <div className="text-gray-700">{appointment.patientName}</div>
                  <div className="text-gray-600">
                    {appointment.timeSlot.startTime} -{" "}
                    {appointment.timeSlot.endTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">
                              Appointment information
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{appointment.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setAppointmentToReschedule(appointment)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Reschedule appointment</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setAppointmentToDelete(appointment)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Delete appointment</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {appointmentToDelete && (
        <DeleteAppointmentModal
          isOpen={!!appointmentToDelete}
          onClose={() => setAppointmentToDelete(null)}
          onConfirm={handleDelete}
          appointment={appointmentToDelete}
          patientName={appointmentToDelete.patientName}
        />
      )}

      {appointmentToReschedule && (
        <RescheduleAppointmentModal
          isOpen={!!appointmentToReschedule}
          onClose={() => setAppointmentToReschedule(null)}
          onConfirm={handleReschedule}
          appointment={appointmentToReschedule}
          timeSlots={timeSlots}
        />
      )}
    </>
  );
}
