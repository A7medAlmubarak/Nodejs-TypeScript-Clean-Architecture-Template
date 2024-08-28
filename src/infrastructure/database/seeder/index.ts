import { seedUsers } from "./userSeeder";

export async function seed() {
  try {
    const users = await seedUsers();
    console.log("seed completed");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seed().catch((error) => console.log(error));
