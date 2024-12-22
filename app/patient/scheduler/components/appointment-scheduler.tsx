"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlot } from "@/types";
import { NewAppointmentModal } from "./new-appointment-modal";

interface AppointmentSchedulerProps {
  timeSlots: Record<string, TimeSlot[]>;
}

export function AppointmentScheduler({ timeSlots }: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedDateString = selectedDate?.toISOString().split("T")[0] ?? "";

  const handleScheduleClick = () => {
    if (selectedDate && selectedTimeSlot) {
      setIsModalOpen(true);
    }
  };

  const handleConfirm = (reason: string) => {
    if (selectedDate && selectedTimeSlot) {
      console.log("Appointment confirmed:", {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        reason,
      });
      // onSchedule(selectedDate, selectedTimeSlot)
      setIsModalOpen(false);
      // Reset selections after scheduling
      setSelectedDate(undefined);
      setSelectedTimeSlot(undefined);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(23, 59, 59, 999);

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>
            Select date and time slot for the new appointment
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-1 w-full flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date < today || date > thirtyDaysFromNow}
              fromDate={today}
              toDate={thirtyDaysFromNow}
            />
          </div>
          <div className="flex-1 w-full max-w-sm">
            {selectedDate && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-center">
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
                      className="w-full text-center"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot.startTime} - {slot.endTime}
                    </Button>
                  ))}
                </div>
                {selectedTimeSlot && (
                  <Button className="w-full" onClick={handleScheduleClick}>
                    Schedule
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {selectedDate && selectedTimeSlot && (
        <NewAppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          date={selectedDate}
          timeSlot={selectedTimeSlot}
          providerName="Doc. Stephen Z."
        />
      )}
    </>
  );
}
