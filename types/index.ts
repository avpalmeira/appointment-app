export type UserRole = "patient" | "provider";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  date: Date;
  timeSlot: TimeSlot;
  patientId: string;
  providerId: string;
}
