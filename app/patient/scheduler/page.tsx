import { TimeSlot } from "@/types";
import { AppointmentScheduler } from "./components/appointment-scheduler";
import db from "@/lib/db";

// This should come from the database: table assigned_providers
const MOCK_PROVIDER = {
  id: "1",
  name: "Doctor Stephen Z.",
};

const MOCK_USER = {
  id: "1",
  name: "Joseph M.",
};

async function getUserByName(userName: string) {
  const { rows } = await db.query(`SELECT * FROM users WHERE name = $1`, [
    userName,
  ]);
  return rows[0];
}

async function getTimeSlotsByProvider(providerId: string) {
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
