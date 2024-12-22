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
import { Appointment, TimeSlot } from "@/types";
import { RescheduleAppointmentModal } from "./reschedule-appointment-modal";

interface ExtendedAppointment extends Appointment {
  patientName: string;
  description: string;
}

export function AppointmentsList() {
  const [selectedAppointment, setSelectedAppointment] =
    useState<ExtendedAppointment | null>(null);
  const [appointmentToReschedule, setAppointmentToReschedule] =
    useState<ExtendedAppointment | null>(null);

  // This would normally come from your API
  const appointments: ExtendedAppointment[] = [
    {
      id: "1",
      date: new Date("2024-12-20"),
      timeSlot: {
        startTime: "10:30",
        endTime: "11:00",
        isAvailable: false,
      },
      patientId: "patient-1",
      providerId: "doc-1",
      patientName: "Joseph M.",
      description: "Regular check-up and consultation",
    },
    {
      id: "2",
      date: new Date("2024-12-26"),
      timeSlot: {
        startTime: "10:30",
        endTime: "11:00",
        isAvailable: false,
      },
      patientId: "patient-1",
      providerId: "doc-1",
      patientName: "Joseph M.",
      description: "Follow-up consultation",
    },
  ];

  const handleDelete = () => {
    if (selectedAppointment) {
      console.log("Deleting appointment:", selectedAppointment.id);
      // Here you would typically call an API to delete the appointment
    }
  };

  const handleReschedule = (newDate: Date, newTimeSlot: TimeSlot) => {
    if (appointmentToReschedule) {
      console.log("Rescheduling appointment:", {
        appointmentId: appointmentToReschedule.id,
        newDate,
        newTimeSlot,
      });
      // Here you would typically call an API to update the appointment
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
            const date = appointment.date.toLocaleDateString("en-US", {
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
                      onClick={() => setSelectedAppointment(appointment)}
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

      {selectedAppointment && (
        <DeleteAppointmentModal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onConfirm={handleDelete}
          appointment={selectedAppointment}
          patientName={selectedAppointment.patientName}
        />
      )}

      {appointmentToReschedule && (
        <RescheduleAppointmentModal
          isOpen={!!appointmentToReschedule}
          onClose={() => setAppointmentToReschedule(null)}
          onConfirm={handleReschedule}
          patientName={appointmentToReschedule.patientName}
          currentDate={appointmentToReschedule.date}
          currentTime={appointmentToReschedule.timeSlot.startTime}
        />
      )}
    </>
  );
}
