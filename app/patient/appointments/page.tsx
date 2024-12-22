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
    SELECT
      appointments.id,
      appointments.description,
      appointments.is_new,
      appointments.patient,
      appointments.provider,
      time_slots.id as time_slot_id,
      time_slots.date,
      time_slots.start_time,
      time_slots.end_time,
      time_slots.status
    FROM appointments 
    JOIN users ON appointments.patient = users.id
    JOIN time_slots ON appointments.time_slot = time_slots.id
    WHERE users.name = $1
    ORDER BY time_slots.date, time_slots.start_time
    `,
      [patientName]
    );

    // Transform database rows to match your Appointment type
    return rows.map((row) => ({
      id: row.id,
      timeSlot: {
        id: row.time_slot_id,
        date: new Date(row.date),
        startTime: row.start_time,
        endTime: row.end_time,
        isAvailable: row.status === "available",
      },
      patient: row.patient,
      provider: row.provider,
      description: row.description,
      isNew: row.is_new,
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
