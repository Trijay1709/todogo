import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  label: text("name").notNull(),
  userId: text("user_id").notNull(),
  completed: boolean("completed").notNull(),
  //   createdAt: timestamp("created_at").defaultNow().notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});
export const categoriesRelations = relations(categories, ({ many }) => ({
  tasks: many(tasks),
}));
export const tasksRelations = relations(tasks, ({ one }) => ({
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
}));
export const insertCategorySchema = createInsertSchema(categories);
export const insertTaskSchema = createInsertSchema(tasks);
