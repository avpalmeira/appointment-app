"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateAppointmentProps {
  description: string;
  time_slot: string;
  patient: string;
  provider: string;
}

export async function createAppointment({
  description,
  time_slot,
  patient,
  provider,
}: CreateAppointmentProps) {
  let client;
  try {
    client = await db.connect();
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO appointments (description, time_slot, patient, provider, is_new) VALUES ($1, $2, $3, $4, true)`,
      [description, time_slot, patient, provider]
    );
    await client.query(
      `UPDATE time_slots
       SET status = 'not_available' 
       WHERE id = $1`,
      [time_slot]
    );
    await client.query("COMMIT");
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
  // TODO: this is linked to a single page, change it to make it reusable
  revalidatePath(`/patient/scheduler`);
}

export interface CreateTimeSlotProps {
  provider: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "available" | "not_available";
}

export async function createTimeSlot({
  provider,
  date,
  startTime,
  endTime,
  status,
}: CreateTimeSlotProps) {
  let client;
  try {
    client = await db.connect();
    await client.query("BEGIN");

    // Check if the time slot is already in the database
    const { rows } = await client.query(
      `SELECT COUNT(*) FROM time_slots WHERE date = $1 AND start_time = $2 AND end_time = $3 AND provider = $4`,
      [date, startTime, endTime, provider]
    );
    if (rows[0].count > 0) {
      throw new Error("Time slot already exists");
    }

    await client.query(
      `INSERT INTO time_slots (date, start_time, end_time, status, provider) VALUES ($1, $2, $3, $4, $5)`,
      [date, startTime, endTime, status, provider]
    );
    await client.query("COMMIT");
  } catch (error) {
    console.error("Error creating time slot:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
  // TODO: this is linked to a single page, change it to make it reusable
  revalidatePath(`/provider/time-slots`);
}

interface RescheduleAppointmentProps {
  appointment: string;
  new_time_slot: string;
}

export async function rescheduleAppointment({
  appointment,
  new_time_slot,
}: RescheduleAppointmentProps) {
  let client;
  try {
    client = await db.connect();
    await client.query("BEGIN");

    // Check if the new time slot is available
    const { rows } = await client.query(
      `SELECT status FROM time_slots WHERE id = $1`,
      [new_time_slot]
    );
    if (!rows.length || rows[0].status !== "available") {
      throw new Error("Selected time slot is not available");
    }

    // Update the current time slot to available
    await client.query(
      `UPDATE time_slots
       SET status = 'available' 
       WHERE id = (SELECT time_slot FROM appointments WHERE id = $1)`,
      [appointment]
    );

    // Update the appointment with the new time slot
    await client.query(
      `UPDATE appointments 
       SET time_slot = $1
       WHERE id = $2`,
      [new_time_slot, appointment]
    );

    // Update the time slot to not available
    await client.query(
      `UPDATE time_slots
       SET status = 'not_available' 
       WHERE id = $1`,
      [new_time_slot]
    );
    await client.query("COMMIT");
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
  // TODO: this is linked to a single page, change it to make it reusable
  revalidatePath(`/provider/appointments`);
}

export async function editTimeSlot(
  id: string,
  { date, startTime, endTime, status, provider }: CreateTimeSlotProps
) {
  let client;
  try {
    client = await db.connect();
    await client.query("BEGIN");
    // Check if the new time slot is already in the database
    const { rows: timeSlotRows } = await client.query(
      `SELECT COUNT(*) FROM time_slots WHERE date = $1 AND start_time = $2 AND end_time = $3 AND provider = $4`,
      [date, startTime, endTime, provider]
    );
    if (timeSlotRows[0].count > 0) {
      throw new Error("New time slot already exists");
    }

    // Check if the time slot is associated with any appointments
    const { rows: appointmentRows } = await client.query(
      `SELECT COUNT(*) FROM appointments WHERE time_slot = $1`,
      [id]
    );
    if (appointmentRows[0].count > 0) {
      throw new Error("Time slot is associated with an appointment");
    }

    await client.query(
      `UPDATE time_slots SET date = $1, start_time = $2, end_time = $3, status = $4, provider = $5 WHERE id = $6`,
      [date, startTime, endTime, status, provider, id]
    );
    await client.query("COMMIT");
  } catch (error) {
    console.error("Error editing time slot:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
  revalidatePath(`/provider/time-slots`);
}

export async function deleteAppointment(
  id: string,
  fromView: "patient" | "provider"
) {
  let client;
  try {
    client = await db.connect();
    await client.query("BEGIN");
    await client.query(
      `UPDATE time_slots ts
       SET status = 'available' 
       FROM appointments a
       WHERE a.id = $1 AND ts.id = a.time_slot`,
      [id]
    );
    await client.query("DELETE FROM appointments WHERE id = $1", [id]);
    await client.query("COMMIT");
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
  revalidatePath(`/${fromView}/appointments`);
}

export async function deleteTimeSlot(id: string) {
  let client;
  try {
    client = await db.connect();
    await client.query("BEGIN");

    // Check if the time slot is associated with any appointments
    const { rows } = await client.query(
      `SELECT COUNT(*) FROM appointments WHERE time_slot = $1`,
      [id]
    );
    if (rows[0].count > 0) {
      throw new Error("Time slot is associated with an appointment");
    }

    await client.query("DELETE FROM time_slots WHERE id = $1", [id]);
    await client.query("COMMIT");
  } catch (error) {
    console.error("Error deleting time slot:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
  // TODO: this is linked to a single page, change it to make it reusable
  revalidatePath(`/provider/time-slots`);
}
