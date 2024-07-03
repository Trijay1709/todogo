import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { error } from "console";
import { connectToDb } from "@/db/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono().get("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const db = connectToDb();
  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .where(eq(categories.userId, auth.userId));
  return c.json({ data });
});

export default app;
