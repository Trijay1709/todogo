import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { error } from "console";
import { db } from "@/db/db";
import {
  categories,
  insertCategorySchema,
  tasks,
  insertTaskSchema,
} from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { json } from "stream/consumers";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const data = await db
      .select({
        id: tasks.id,
        label: tasks.label,
        categoryId: tasks.categoryId,
        completed: tasks.completed,
        category: categories.name,
        createdAt: tasks.createdAt,
      })
      .from(tasks)
      .leftJoin(categories, eq(categories.id, tasks.categoryId))
      .where(eq(tasks.userId, auth.userId))
      .orderBy(desc(tasks.createdAt));
    return c.json({ data });
  })
  .get(
    "/:categoryId",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        categoryId: z.string(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { categoryId } = c.req.valid("param");
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      if (!categoryId) {
        return c.json({ error: "Bad request" }, 400);
      }
      const data = await db
        .select({
          id: tasks.id,
          label: tasks.label,
          categoryId: tasks.categoryId,
          completed: tasks.completed,
          category: categories.name,
          createdAt: tasks.createdAt,
        })
        .from(tasks)
        .leftJoin(categories, eq(categories.id, tasks.categoryId))
        .where(
          and(eq(tasks.categoryId, categoryId), eq(tasks.userId, auth.userId))
        )
        .orderBy(desc(tasks.createdAt));
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTaskSchema.omit({
        id: true,
        userId: true,
        completed: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const [data] = await db
        .insert(tasks)
        .values({
          ...values,
          id: createId(),
          userId: auth.userId,
          completed: false,
        })
        .returning();
      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "json",
      insertTaskSchema.omit({
        id: true,
        userId: true,
        completed: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");
      if (!id) {
        return c.json({ error: "Bad request" }, 400);
      }
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const [data] = await db
        .update(tasks)
        .set({
          ...values,
          completed: false,
        })
        .where(and(eq(tasks.id, id), eq(tasks.userId, auth.userId)))
        .returning();
      if (!data) {
        return c.json({ error: "Not Found" }, 404);
      }
      return c.json({ data });
    }
  )
  .patch(
    "/complete/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "json",
      insertTaskSchema.pick({
        completed: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");
      if (!id) {
        return c.json({ error: "Bad request" }, 400);
      }
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const [data] = await db
        .update(tasks)
        .set({
          ...values,
        })
        .where(and(eq(tasks.id, id), eq(tasks.userId, auth.userId)))
        .returning();
      if (!data) {
        return c.json({ error: "Not Found" }, 404);
      }
      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      if (!id) {
        return c.json({ error: "Bad request" }, 400);
      }
      const [data] = await db
        .delete(tasks)
        .where(and(eq(tasks.id, id), eq(tasks.userId, auth.userId)))
        .returning({ id: tasks.id });
      if (!data) {
        return c.json({ error: "Not Found" }, 404);
      }
      return c.json({ data });
    }
  );

export default app;
