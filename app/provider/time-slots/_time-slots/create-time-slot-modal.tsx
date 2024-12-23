import { useState } from "react";
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

interface CreateTimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSlot: CreateTimeSlotProps) => void;
  existingSlots: TimeSlot[];
  selectedDate: Date;
  provider: string;
}

export function CreateTimeSlotModal({
  isOpen,
  onClose,
  onSave,
  existingSlots,
  selectedDate,
  provider,
}: CreateTimeSlotModalProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>();
  const allPossibleSlots = generateTimeSlots();
  const availableSlots = allPossibleSlots.filter(
    (slot) =>
      !existingSlots.some(
        (existing) =>
          existing.startTime === slot.startTime &&
          existing.endTime === slot.endTime
      )
  );

  const handleSave = () => {
    if (selectedTimeRange) {
      const [startTime, endTime] = selectedTimeRange.split(" - ");
      onSave({
        date: selectedDate,
        startTime,
        endTime,
        status: "available",
        provider,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            Create 30 minutes time slot
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
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a time slot" />
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
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-sky-100 hover:bg-sky-200 text-gray-800"
            onClick={handleSave}
            disabled={!selectedTimeRange}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
