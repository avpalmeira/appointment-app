export type UserRole = "patient" | "provider";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  description: string;
  isNew: boolean;
  timeSlot: TimeSlot;
  patient: string;
  provider: string;
}
