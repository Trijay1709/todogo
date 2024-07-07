import { categories, tasks } from "../src/db/schema";
// import { v4 as createId } from "uuid";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

import { Client } from "pg";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
const sql = neon(
  "postgresql://neondb_owner:uQLjc8zi9rFv@ep-autumn-sun-a4mqr2ha.us-east-1.aws.neon.tech/neondb?sslmode=require"
);
export const db = drizzle(sql);

const seed = async () => {
  const userId = "user_2iFTbN0LHBc5uKs62sWy2JRzcbv";
  //Seed categories
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
  //   const data = await db
  //     .select({
  //       id: categories.id,
  //       name: categories.name,
  //     })
  //     .from(categories)
  //     .where(eq(categories.userId, userId));

  //   console.log(data);
};
seed()
  .catch((error) => {
    console.error("Error seeding data:", error);
  })
  .finally();
