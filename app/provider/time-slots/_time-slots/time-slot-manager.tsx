"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlot } from "@/types";
import { EditTimeSlotModal } from "./edit-time-slot-modal";
import { CreateTimeSlotModal } from "./create-time-slot-modal";
import {
  createTimeSlot,
  CreateTimeSlotProps,
  deleteTimeSlot,
} from "@/lib/actions";

const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 30);

interface TimeSlotManagerProps {
  timeSlots: Record<string, TimeSlot[]>;
  provider: string;
}

export default function TimeSlotManager({
  timeSlots,
  provider,
}: TimeSlotManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const selectedDateString = selectedDate?.toISOString().split("T")[0] ?? "";

  const handleAddTimeSlot = (newSlot: CreateTimeSlotProps) => {
    createTimeSlot(newSlot);
    setIsCreateModalOpen(false);
  };

  const handleEditSlot = (newSlot: TimeSlot) => {
    setSelectedSlot(null);
  };

  const handleDeleteSlot = () => {
    if (selectedSlot) {
      deleteTimeSlot(selectedSlot.id);
      setSelectedSlot(null);
    }
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
                  {timeSlots[selectedDateString]?.map((slot) => (
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
          existingSlots={timeSlots[selectedDateString] ?? []}
          selectedDate={selectedDate}
        />
      )}

      {selectedDate && (
        <CreateTimeSlotModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleAddTimeSlot}
          existingSlots={timeSlots[selectedDateString] ?? []}
          selectedDate={selectedDate}
          provider={provider}
        />
      )}
    </>
  );
}
