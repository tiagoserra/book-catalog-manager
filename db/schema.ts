import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isbn: text("isbn").notNull(),
  description: text("description").notNull(),
  pageCount: integer("page_count").notNull(),
  author: text("author").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const insertBookSchema = createInsertSchema(books);
export const selectBookSchema = createSelectSchema(books);
export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;
