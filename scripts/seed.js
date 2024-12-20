import pool from "../lib/db.js";

async function seedUsers() {
  let patientId = null;
  let providerId = null;

  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) CHECK (role IN ('patient', 'provider')) NOT NULL
      );
    `);

    // Insert users
    const patientResult = await pool.query(
      `
      INSERT INTO users (name, role)
      VALUES ($1, $2)
      RETURNING id;
    `,
      ["Joseph M.", "patient"]
    );
    patientId = patientResult.rows[0].id;

    const providerResult = await pool.query(
      `
      INSERT INTO users (name, role) 
      VALUES ($1, $2)
      RETURNING id;
    `,
      ["Doctor Stephen Z.", "provider"]
    );
    providerId = providerResult.rows[0].id;

    console.log("Users table created and populated successfully");
  } catch (error) {
    console.error("Error creating table / populating users:", error);
  }
  return { patientId, providerId };
}

async function seedTimeSlots(providerId) {
  if (!providerId) {
    throw new Error("Provider ID is required");
  }

  let day3TimeSlotId = null;
  let day10TimeSlotId = null;
  let day20TimeSlotId = null;

  try {
    // Create time_slots table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        provider UUID REFERENCES users(id),
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR(50) CHECK (status IN ('available', 'not_available')) DEFAULT 'available'
      );
    `);

    // Insert time slots for next 30 days
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(tomorrow);
      currentDate.setDate(currentDate.getDate() + i);

      await pool.query(
        `
        INSERT INTO time_slots (provider, date, start_time, end_time, status)
        VALUES 
          ($1, $2, '10:00', '10:30', 'available'),
          ($1, $2, '11:00', '11:30', 'available'),
          ($1, $2, '14:00', '14:30', 'available');
      `,
        [providerId, currentDate]
      );
    }

    // Get specific time slot IDs for appointments
    const day3TimeSlot = await pool.query(
      `
      SELECT id FROM time_slots 
      WHERE date = $1 AND start_time = '10:00' AND provider = $2;
    `,
      [new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000), providerId]
    );
    day3TimeSlotId = day3TimeSlot.rows[0].id;

    const day10TimeSlot = await pool.query(
      `
      SELECT id FROM time_slots 
      WHERE date = $1 AND start_time = '10:00' AND provider = $2;
    `,
      [new Date(tomorrow.getTime() + 9 * 24 * 60 * 60 * 1000), providerId]
    );
    day10TimeSlotId = day10TimeSlot.rows[0].id;

    const day20TimeSlot = await pool.query(
      `
      SELECT id FROM time_slots 
      WHERE date = $1 AND start_time = '14:00' AND provider = $2;
    `,
      [new Date(tomorrow.getTime() + 19 * 24 * 60 * 60 * 1000), providerId]
    );
    day20TimeSlotId = day20TimeSlot.rows[0].id;

    console.log("Time slots table created and populated successfully");
  } catch (error) {
    console.error("Error creating table / populating time slots:", error);
  }

  if (!day3TimeSlotId || !day10TimeSlotId || !day20TimeSlotId) {
    throw new Error("Failed to get time slot IDs");
  }

  return [day3TimeSlotId, day10TimeSlotId, day20TimeSlotId];
}

async function seedAppointments(patientId, providerId, timeSlots) {
  if (!patientId || !providerId || !timeSlots) {
    throw new Error("Invalid input parameters");
  }

  const [day3TimeSlotId, day10TimeSlotId, day20TimeSlotId] = timeSlots;

  try {
    // Create appointments table
    await pool.query(`
          CREATE TABLE IF NOT EXISTS appointments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            patient UUID REFERENCES users(id),
            provider UUID REFERENCES users(id),
            time_slot UUID REFERENCES time_slots(id),
            description TEXT,
            is_new BOOLEAN NOT NULL
          );
        `);

    // Insert appointments
    await pool.query(
      `
      INSERT INTO appointments (patient, provider, time_slot, description, is_new)
      VALUES
        ($1, $2, $3, 'regular consultation', true),
        ($1, $2, $4, 'MRI exams', true),
        ($1, $2, $5, 'return session', false);
    `,
      [patientId, providerId, day3TimeSlotId, day10TimeSlotId, day20TimeSlotId]
    );

    console.log("Appointments table created and populated successfully");

    // Update time slots status for booked appointments
    await pool.query(
      `
      UPDATE time_slots
      SET status = 'not_available'
      WHERE id IN ($1, $2, $3);
    `,
      [day3TimeSlotId, day10TimeSlotId, day20TimeSlotId]
    );

    console.log("Time slots updated successfully");
  } catch (error) {
    console.error("Error creating table / populating appointments:", error);
  }
}

export async function seed() {
  console.log("Connecting to database...");
  const client = await pool.connect();
  try {
    console.log("Seeding users...");
    await client.query("BEGIN");
    const { patientId, providerId } = await seedUsers();
    console.log("Seeding time slots...");
    const timeSlots = await seedTimeSlots(providerId);
    console.log("Seeding appointments...");
    await seedAppointments(patientId, providerId, timeSlots);
    console.log("Committing transaction...");
    await client.query("COMMIT");
    console.log("Database seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
  } finally {
    await client.release();
    console.log("Database connection closed");
  }
  process.exit(0);
}

seed();
