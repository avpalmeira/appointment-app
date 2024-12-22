import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TimeSlot } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const totalMinutesInDay = 24 * 60;
  const intervalMinutes = 30;

  for (
    let minutes = 0;
    minutes < totalMinutesInDay;
    minutes += intervalMinutes
  ) {
    const startHour = Math.floor(minutes / 60);
    const startMinute = minutes % 60;
    const endHour = Math.floor((minutes + intervalMinutes) / 60) % 24;
    const endMinute = (minutes + intervalMinutes) % 60;

    const startTime = `${String(startHour).padStart(2, "0")}:${String(
      startMinute
    ).padStart(2, "0")}`;
    const endTime = `${String(endHour).padStart(2, "0")}:${String(
      endMinute
    ).padStart(2, "0")}`;

    slots.push({
      startTime,
      endTime,
      isAvailable: true,
    });
  }

  return slots;
}
