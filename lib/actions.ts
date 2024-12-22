"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateAppointmentProps {
  description: string;
  time_slot: string;
  patient: string;
  provider: string;
  fromView: "patient" | "provider";
}

export async function createAppointment({
  description,
  time_slot,
  patient,
  provider,
  fromView,
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
  revalidatePath(`/${fromView}/scheduler`);
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
