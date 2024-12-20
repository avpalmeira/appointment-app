"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlot } from "@/types";

const TIME_SLOTS: TimeSlot[] = [
  { startTime: "10:00", endTime: "10:30", isAvailable: true },
  { startTime: "11:00", endTime: "11:30", isAvailable: true },
  { startTime: "14:00", endTime: "14:30", isAvailable: true },
];

export function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Select date and time slot for the new appointment</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex-1 w-full flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
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
                {TIME_SLOTS.map((slot) => (
                  <Button
                    key={slot.startTime}
                    variant={selectedTimeSlot === slot ? "default" : "outline"}
                    className="w-full text-center"
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    {slot.startTime} - {slot.endTime}
                  </Button>
                ))}
              </div>
              {selectedTimeSlot && (
                <Button className="w-full" onClick={() => {}}>
                  Schedule
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
