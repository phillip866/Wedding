import { pgTable, text, serial, integer, boolean, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Guest Management
export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  category: text("category").notNull(), // Family, Friends, Colleagues etc.
  rsvpStatus: text("rsvp_status").default("pending"), // pending, confirmed, declined
  plusOne: boolean("plus_one").default(false),
  dietaryRestrictions: text("dietary_restrictions"),
  notes: text("notes")
});

// Budget Items
export const budgetItems = pgTable("budget_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // Venue, Catering, etc.
  description: text("description").notNull(),
  estimatedAmount: decimal("estimated_amount").notNull(),
  actualAmount: decimal("actual_amount"),
  paid: boolean("paid").default(false),
  dueDate: date("due_date")
});

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  completed: boolean("completed").default(false),
  priority: text("priority").default("medium") // low, medium, high
});

// Vendors
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Photographer, Caterer, Venue, etc.
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  notes: text("notes"),
  appointmentDate: date("appointment_date")
});

// Insert Schemas
export const insertGuestSchema = createInsertSchema(guests).omit({ id: true });
export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true });

// Types
export type Guest = typeof guests.$inferSelect;
export type BudgetItem = typeof budgetItems.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertVendor = z.infer<typeof insertVendorSchema>;