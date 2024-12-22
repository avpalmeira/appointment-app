import { getAppointmentsByProvider } from "@/lib/query";
import { AppointmentsList } from "./_appointments/appointments-list";

// This would normally come from your authentication system
const MOCK_USER = {
  name: "Doctor Stephen Z.",
  role: "provider" as const,
};

export default async function AppointmentsPage() {
  const appointments = await getAppointmentsByProvider(MOCK_USER.name);

  return <AppointmentsList appointments={appointments} />;
}
