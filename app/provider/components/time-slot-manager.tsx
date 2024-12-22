"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlot } from "@/types";
import { EditTimeSlotModal } from "./edit-time-slot-modal";
import { CreateTimeSlotModal } from "./create-time-slot-modal";

const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 30);

const TIME_SLOTS: TimeSlot[] = [
  { startTime: "10:00", endTime: "10:30", isAvailable: true },
  { startTime: "11:00", endTime: "11:30", isAvailable: true },
  { startTime: "14:00", endTime: "14:30", isAvailable: true },
];

export function TimeSlotManager() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>(TIME_SLOTS);

  const handleAddTimeSlot = () => {
    // This will be implemented later with a modal to add new time slots
    console.log("Add new time slot");
  };

  const handleEditSlot = (newSlot: TimeSlot) => {
    if (selectedSlot) {
      setSlots((currentSlots) =>
        currentSlots.map((slot) => (slot === selectedSlot ? newSlot : slot))
      );
    }
    setSelectedSlot(null);
  };

  const handleDeleteSlot = () => {
    // This will be implemented later with a modal to add new time slots
    console.log("Delete time slot");
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Manage availability by selecting date and time below
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex justify-center">
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
                <h3 className="text-lg font-medium text-center">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <div className="space-y-2">
                  {slots.map((slot) => (
                    <Button
                      key={`${slot.startTime}-${slot.endTime}`}
                      disabled={!slot.isAvailable}
                      variant="outline"
                      className="w-full text-center"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.startTime} - {slot.endTime}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full text-center"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add time slot
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedSlot && selectedDate && (
        <EditTimeSlotModal
          isOpen={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSave={handleEditSlot}
          onDelete={handleDeleteSlot}
          currentSlot={selectedSlot}
          existingSlots={slots}
          selectedDate={selectedDate}
        />
      )}

      {selectedDate && (
        <CreateTimeSlotModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleAddTimeSlot}
          existingSlots={slots}
          selectedDate={selectedDate}
        />
      )}
    </>
  );
}
