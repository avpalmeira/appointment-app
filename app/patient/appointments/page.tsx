import { AppointmentsList } from "./components/appointments-list";
import db from "@/lib/db";

// This would normally come from your authentication system
const MOCK_USER = {
  name: "Joseph M.",
  role: "patient" as const,
};

async function getAppointments(patientName: string) {
  try {
    const { rows } = await db.query(
      `
    SELECT * FROM appointments 
    JOIN users ON appointments.patient = users.id
    JOIN time_slots ON appointments.time_slot = time_slots.id
    WHERE users.name = $1
    ORDER BY date, start_time
    `,
      [patientName]
    );

    // Transform database rows to match your Appointment type
    return rows.map((row) => ({
      id: row.id,
      date: new Date(row.date),
      timeSlot: {
        startTime: row.start_time,
        endTime: row.end_time,
        isAvailable: row.status === "available",
      },
      patientId: row.patient,
      providerId: row.provider,
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments(MOCK_USER.name);

  return <AppointmentsList appointments={appointments} />;
}
