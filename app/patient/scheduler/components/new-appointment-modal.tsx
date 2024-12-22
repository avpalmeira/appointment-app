"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { User, TimeSlot } from "@/types";
import { useState } from "react";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  date: Date;
  timeSlot: TimeSlot;
  provider: User;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  date,
  timeSlot,
  provider,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: modify onConfirm to accept null values
    onConfirm(formData?.get("reason") as string);
  };

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    setFormData(new FormData(e.currentTarget));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            Add more information about the appointment
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} onChange={handleChange}>
          <div className="flex justify-between text-xl text-gray-700 mb-6">
            <div>{provider.name}</div>
            <div>
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div>
              {timeSlot.startTime} - {timeSlot.endTime}
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="appointment-reason"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Reason for appointment
            </label>
            <Textarea
              id="appointment-reason"
              name="reason"
              placeholder="Describe the reason for the appointment..."
              className="min-h-[100px] mb-6"
              aria-describedby="reason-description"
              required
            />
            <p id="reason-description" className="sr-only">
              Please provide details about why you are scheduling this
              appointment
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData?.get("reason")}
              className={`${
                formData?.get("reason")
                  ? "bg-sky-500 hover:bg-sky-600"
                  : "bg-sky-100"
              }`}
            >
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
