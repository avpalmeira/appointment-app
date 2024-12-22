"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Appointment } from "@/types";

interface DeleteAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointment: Appointment;
  patientName: string;
}

export function DeleteAppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  patientName,
}: DeleteAppointmentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            Are you sure you want to delete this appointment?
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-between text-xl text-gray-700 my-12">
          <div>{patientName}</div>
          <div>
            {new Date(appointment.timeSlot.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div>
            {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
