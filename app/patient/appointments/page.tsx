import { getAppointmentsByPatient } from "@/lib/query";
import { AppointmentsList } from "./_appointments/appointments-list";

// This would normally come from your authentication system
const MOCK_USER = {
  name: "Joseph M.",
  role: "patient" as const,
};

export default async function AppointmentsPage() {
  const appointments = await getAppointmentsByPatient(MOCK_USER.name);

  return <AppointmentsList appointments={appointments} />;
}
