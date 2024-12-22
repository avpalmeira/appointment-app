import { TimeSlot } from "@/types";
import { AppointmentScheduler } from "./components/appointment-scheduler";
import db from "@/lib/db";

const MOCK_PROVIDER = {
  id: "1",
  name: "Doctor Stephen Z.",
};

async function getTimeSlotsByProvider(providerName: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(23, 59, 59, 999);

  try {
    const { rows } = await db.query(
      `
      SELECT 
        time_slots.id,
        date,
        start_time,
        end_time,
        status
      FROM time_slots
      JOIN users ON time_slots.provider = users.id
      WHERE users.name = $1
      AND date >= $2
      AND date <= $3
      ORDER BY time_slots.date, time_slots.start_time
      `,
      [providerName, today.toISOString(), thirtyDaysFromNow.toISOString()]
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
        id: row.time_slots_id,
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
  const timeSlots = await getTimeSlotsByProvider(MOCK_PROVIDER.name);

  return <AppointmentScheduler timeSlots={timeSlots} />;
}
