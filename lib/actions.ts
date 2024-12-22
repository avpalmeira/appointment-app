"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

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
