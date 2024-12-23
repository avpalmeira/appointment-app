import { getTimeSlotsByProvider, getUserByName } from "@/lib/query";
import TimeSlotManager from "./_time-slots/time-slot-manager";

// This would normally come from your authentication system
const MOCK_USER = {
  name: "Doctor Stephen Z.",
  role: "provider" as const,
};

export default async function TimeSlotsPage() {
  const provider = await getUserByName(MOCK_USER.name);
  const timeSlots = await getTimeSlotsByProvider(provider.id);

  return <TimeSlotManager timeSlots={timeSlots} />;
}
