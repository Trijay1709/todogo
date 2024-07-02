import { categories, tasks } from "../db/schema";
// import { v4 as createId } from "uuid";
import { createId } from "@paralleldrive/cuid2";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
const client = new Client({
  connectionString:
    "postgresql://trijay:Ebi_wB0ZfSjmVRGZZ0oY8w@boreal-rhino-5229.7s5.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
});

// or
// async () => {
//   try {
// } catch (err) {
//     console.log("Error connecting database" + err);
// }
// };
client.connect();
console.log("Hello");

export const db = drizzle(client);
// Create seed data
const seed = async () => {
  const userId = "user_2iFTbN0LHBc5uKs62sWy2JRzcbv"; // Assuming a single user for simplicity

  // Seed categories
  const categoryData = [
    { id: createId(), name: "Work", userId },
    { id: createId(), name: "Personal", userId },
    { id: createId(), name: "Health", userId },
    { id: createId(), name: "Shopping", userId },
    { id: createId(), name: "Miscellaneous", userId },
  ];
  await db.insert(categories).values(categoryData);

  // Seed tasks
  const categoryIds = categoryData.map((category) => category.id);

  const taskData = Array.from({ length: 20 }, () => ({
    id: createId(),
    label: `Task ${Math.floor(Math.random() * 100)}`,
    userId,
    completed: Math.random() > 0.5,
    categoryId: categoryIds[Math.floor(Math.random() * categoryIds.length)],
  }));
  await db.insert(tasks).values(taskData);

  console.log("Seeding completed!");
};

seed().catch((error) => {
  console.error("Error seeding data:", error);
});
