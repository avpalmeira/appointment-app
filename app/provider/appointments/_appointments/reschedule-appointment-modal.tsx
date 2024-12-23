"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TimeSlot, ExtendedAppointment } from "@/types";

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointment: ExtendedAppointment, newTimeSlot: TimeSlot) => void;
  appointment: ExtendedAppointment;
  timeSlots: Record<string, TimeSlot[]>;
}

export function RescheduleAppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  timeSlots,
}: RescheduleAppointmentModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>();

  const selectedDateString = selectedDate?.toISOString().split("T")[0] ?? "";

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const handleConfirm = () => {
    if (selectedTimeSlot) {
      onConfirm(appointment, selectedTimeSlot);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            Reschedule for: {appointment?.patientName} (
            {appointment?.timeSlot?.date?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            - {appointment?.timeSlot?.startTime})
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-8 items-start py-4">
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) =>
                date < today ||
                date > maxDate ||
                date < new Date(today.setHours(0, 0, 0, 0))
              }
            />
          </div>

          <div className="flex-1">
            {selectedDate && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <div className="space-y-2">
                  {timeSlots[selectedDateString]?.map((slot) => (
                    <Button
                      key={slot.startTime}
                      variant={
                        selectedTimeSlot === slot ? "default" : "outline"
                      }
                      disabled={!slot.isAvailable}
                      className="w-full text-center"
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot.startTime} - {slot.endTime}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className={`${
              selectedDate && selectedTimeSlot
                ? "bg-sky-500 hover:bg-sky-600"
                : "bg-sky-100"
            }`}
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTimeSlot}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
