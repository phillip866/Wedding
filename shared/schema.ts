import { pgTable, text, serial, integer, boolean, date, decimal, timestamp } from "drizzle-orm/pg-core";
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
  tableAssignment: text("table_assignment"),
  mealChoice: text("meal_choice"),
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
  dueDate: date("due_date"),
  vendorId: integer("vendor_id"),
  receiptImage: text("receipt_image")
});

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  completed: boolean("completed").default(false),
  priority: text("priority").default("medium"), // low, medium, high
  category: text("category"), // e.g., "Pre-wedding", "Wedding day", "Post-wedding"
  assignedTo: text("assigned_to") // e.g., "Bride", "Groom", "Planner"
});

// Vendors
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "Photographer", "Caterer", "Venue"
  contactName: text("contact_name"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  address: text("address"),
  notes: text("notes"),
  contractFile: text("contract_file") // File path or URL
});

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  vendorId: integer("vendor_id"),
  date: date("date").notNull(),
  time: text("time").notNull(),
  location: text("location"),
  notes: text("notes"),
  reminder: boolean("reminder").default(true)
});

// Seating Plans
export const seatingPlans = pgTable("seating_plans", {
  id: serial("id").primaryKey(),
  tableName: text("table_name").notNull(),
  capacity: integer("capacity").notNull(),
  category: text("category"), // e.g., "Family", "Friends", "Colleagues"
  location: text("location") // Position on the venue map
});

// User Settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  weddingDate: date("wedding_date"),
  coupleNames: text("couple_names"),
  venueAddress: text("venue_address"),
  theme: text("theme").default("default"), // For UI customization
  isPremium: boolean("is_premium").default(false) // Premium status
});

// Insert Schemas
export const insertGuestSchema = createInsertSchema(guests).omit({ id: true });
export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export const insertSeatingPlanSchema = createInsertSchema(seatingPlans).omit({ id: true });
export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ id: true });

// Types
export type Guest = typeof guests.$inferSelect;
export type BudgetItem = typeof budgetItems.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type SeatingPlan = typeof seatingPlans.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;

export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertSeatingPlan = z.infer<typeof insertSeatingPlanSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
