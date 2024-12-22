import db from "@/lib/db";
import { TimeSlot } from "@/types";

export async function getAppointmentsByPatient(patientName: string) {
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
        startTime: row.start_time.substring(0, 5),
        endTime: row.end_time.substring(0, 5),
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

export async function getAppointmentsByProvider(providerName: string) {
  try {
    const { rows } = await db.query(
      `
    SELECT
      appointments.id,
      appointments.description,
      appointments.is_new,
      pt.name as patient_name,
      p.id as provider,
      time_slots.id as time_slot_id,
      time_slots.date,
      time_slots.start_time,
      time_slots.end_time,
      time_slots.status
    FROM appointments 
    JOIN users p ON appointments.provider = p.id
    JOIN users pt ON appointments.patient = pt.id
    JOIN time_slots ON appointments.time_slot = time_slots.id
    WHERE p.name = $1
    ORDER BY time_slots.date, time_slots.start_time
    `,
      [providerName]
    );

    // Transform database rows to match your Appointment type
    return rows.map((row) => ({
      id: row.id,
      timeSlot: {
        id: row.time_slot_id,
        date: new Date(row.date),
        startTime: row.start_time.substring(0, 5),
        endTime: row.end_time.substring(0, 5),
        isAvailable: row.status === "available",
      },
      patient: row.patient,
      provider: row.provider,
      patientName: row.patient_name,
      description: row.description,
      isNew: row.is_new,
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function getUserByName(userName: string) {
  const { rows } = await db.query(`SELECT * FROM users WHERE name = $1`, [
    userName,
  ]);
  return rows[0];
}

export async function getTimeSlotsByProvider(providerId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(23, 59, 59, 999);

  try {
    const { rows } = await db.query(
      `
      SELECT 
        id,
        date,
        start_time,
        end_time,
        status
      FROM time_slots
      WHERE provider = $1
      AND date >= $2
      AND date <= $3
      ORDER BY date, start_time
      `,
      [providerId, today.toISOString(), thirtyDaysFromNow.toISOString()]
    );

    // Transform into object grouped by date
    return rows.reduce((acc: Record<string, Array<TimeSlot>>, row) => {
      const dateStr = new Date(row.date).toISOString().split("T")[0]; // YYYY-MM-DD format
      const startTime = row.start_time.substring(0, 5);
      const endTime = row.end_time.substring(0, 5);

      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }

      acc[dateStr].push({
        id: row.id,
        date: row.date,
        startTime: startTime,
        endTime: endTime,
        isAvailable: row.status === "available",
      });

      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return {};
  }
}
