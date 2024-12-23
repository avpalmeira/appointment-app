import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeSlot } from "@/types";
import { generateTimeSlots } from "@/lib/utils";
import { CreateTimeSlotProps } from "@/lib/actions";
import { useState } from "react";

interface EditTimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentSlotId: string, newSlot: CreateTimeSlotProps) => void;
  onDelete: () => void;
  currentSlot: TimeSlot;
  existingSlots: TimeSlot[];
  selectedDate: Date;
  provider: string;
}

export function EditTimeSlotModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  currentSlot,
  existingSlots,
  selectedDate,
  provider,
}: EditTimeSlotModalProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(
    `${currentSlot.startTime} - ${currentSlot.endTime}`
  );
  const allPossibleSlots = generateTimeSlots();
  const availableSlots = allPossibleSlots.filter(
    (slot) =>
      !existingSlots.some(
        (existing) =>
          existing.startTime === slot.startTime &&
          existing.endTime === slot.endTime
      ) ||
      (currentSlot.startTime === slot.startTime &&
        currentSlot.endTime === slot.endTime)
  );

  const handleTimeRangeChange = (newTimeRange: string) => {
    setSelectedTimeRange(newTimeRange);
  };

  const handleSave = () => {
    const [startTime, endTime] = selectedTimeRange.split(" - ");
    onSave(currentSlot.id, {
      date: selectedDate,
      startTime,
      endTime,
      status: "available",
      provider,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            Edit 30 minutes time slot
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="text-lg mb-4">
            {selectedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            :
          </div>

          <Select
            defaultValue={`${currentSlot.startTime} - ${currentSlot.endTime}`}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableSlots.map((slot) => (
                <SelectItem
                  key={`${slot.startTime}-${slot.endTime}`}
                  value={`${slot.startTime} - ${slot.endTime}`}
                >
                  {slot.startTime} - {slot.endTime}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
          <Button
            className="bg-sky-100 hover:bg-sky-200 text-gray-800"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
