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
import { TimeSlot } from "@/types";

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDate: Date, newTimeSlot: TimeSlot) => void;
  patientName: string;
  currentDate: Date;
  currentTime: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { startTime: "10:00", endTime: "10:30", isAvailable: true },
  { startTime: "11:00", endTime: "11:30", isAvailable: true },
  { startTime: "14:00", endTime: "14:30", isAvailable: true },
];

export function RescheduleAppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  patientName,
  currentDate,
  currentTime,
}: RescheduleAppointmentModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>();

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const handleConfirm = () => {
    if (selectedDate && selectedTimeSlot) {
      onConfirm(selectedDate, selectedTimeSlot);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            Reschedule for: {patientName} (
            {currentDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            - {currentTime})
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
                  {TIME_SLOTS.map((slot) => (
                    <Button
                      key={slot.startTime}
                      variant={
                        selectedTimeSlot === slot ? "default" : "outline"
                      }
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
            className="bg-sky-100 hover:bg-sky-200"
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
