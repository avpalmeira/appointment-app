import { AppointmentScheduler } from "./_scheduler/appointment-scheduler";
import { getTimeSlotsByProvider, getUserByName } from "@/lib/query";

// This should come from the database: table assigned_providers
const MOCK_PROVIDER = {
  id: "1",
  name: "Doctor Stephen Z.",
};

const MOCK_USER = {
  id: "1",
  name: "Joseph M.",
};

export default async function AppointmentSchedulerPage() {
  const user = await getUserByName(MOCK_USER.name);
  const provider = await getUserByName(MOCK_PROVIDER.name);
  const timeSlots = await getTimeSlotsByProvider(provider.id);

  return (
    <AppointmentScheduler
      timeSlots={timeSlots}
      user={user}
      provider={provider}
    />
  );
}
