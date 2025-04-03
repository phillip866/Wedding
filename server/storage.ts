import { 
  type Guest, type InsertGuest,
  type BudgetItem, type InsertBudgetItem,
  type Task, type InsertTask,
  type Vendor, type InsertVendor,
  type Appointment, type InsertAppointment,
  type SeatingPlan, type InsertSeatingPlan,
  type UserSettings, type InsertUserSettings
} from "@shared/schema";

export interface IStorage {
  // Guest Management
  getGuests(): Promise<Guest[]>;
  getGuest(id: number): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: number, guest: Partial<InsertGuest>): Promise<Guest | undefined>;
  deleteGuest(id: number): Promise<boolean>;

  // Budget Management
  getBudgetItems(): Promise<BudgetItem[]>;
  getBudgetItem(id: number): Promise<BudgetItem | undefined>;
  createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem>;
  updateBudgetItem(id: number, item: Partial<InsertBudgetItem>): Promise<BudgetItem | undefined>;
  deleteBudgetItem(id: number): Promise<boolean>;

  // Task Management
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Vendor Management
  getVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined>;
  deleteVendor(id: number): Promise<boolean>;
  
  // Appointment Management
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Seating Plan Management
  getSeatingPlans(): Promise<SeatingPlan[]>;
  getSeatingPlan(id: number): Promise<SeatingPlan | undefined>;
  createSeatingPlan(plan: InsertSeatingPlan): Promise<SeatingPlan>;
  updateSeatingPlan(id: number, plan: Partial<InsertSeatingPlan>): Promise<SeatingPlan | undefined>;
  deleteSeatingPlan(id: number): Promise<boolean>;
  
  // User Settings Management
  getUserSettings(): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(id: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined>;
}

export class MemStorage implements IStorage {
  private guests: Map<number, Guest>;
  private budgetItems: Map<number, BudgetItem>;
  private tasks: Map<number, Task>;
  private vendors: Map<number, Vendor>;
  private appointments: Map<number, Appointment>;
  private seatingPlans: Map<number, SeatingPlan>;
  private userSettings: Map<number, UserSettings>;
  
  private guestId: number;
  private budgetId: number;
  private taskId: number;
  private vendorId: number;
  private appointmentId: number;
  private seatingPlanId: number;
  private userSettingsId: number;

  constructor() {
    this.guests = new Map();
    this.budgetItems = new Map();
    this.tasks = new Map();
    this.vendors = new Map();
    this.appointments = new Map();
    this.seatingPlans = new Map();
    this.userSettings = new Map();
    
    this.guestId = 1;
    this.budgetId = 1;
    this.taskId = 1;
    this.vendorId = 1;
    this.appointmentId = 1;
    this.seatingPlanId = 1;
    this.userSettingsId = 1;
  }

  // Guest Management
  async getGuests(): Promise<Guest[]> {
    return Array.from(this.guests.values());
  }

  async getGuest(id: number): Promise<Guest | undefined> {
    return this.guests.get(id);
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const id = this.guestId++;
    const newGuest: Guest = {
      id,
      name: guest.name,
      email: guest.email ?? null,
      phone: guest.phone ?? null,
      category: guest.category,
      rsvpStatus: guest.rsvpStatus ?? null,
      plusOne: guest.plusOne ?? null,
      dietaryRestrictions: guest.dietaryRestrictions ?? null,
      tableAssignment: guest.tableAssignment ?? null,
      mealChoice: guest.mealChoice ?? null,
      notes: guest.notes ?? null
    };
    this.guests.set(id, newGuest);
    return newGuest;
  }

  async updateGuest(id: number, guest: Partial<InsertGuest>): Promise<Guest | undefined> {
    const existing = this.guests.get(id);
    if (!existing) return undefined;
    const updated: Guest = {
      ...existing,
      ...guest,
      email: guest.email ?? existing.email,
      phone: guest.phone ?? existing.phone,
      rsvpStatus: guest.rsvpStatus ?? existing.rsvpStatus,
      plusOne: guest.plusOne ?? existing.plusOne,
      dietaryRestrictions: guest.dietaryRestrictions ?? existing.dietaryRestrictions,
      tableAssignment: guest.tableAssignment ?? existing.tableAssignment,
      mealChoice: guest.mealChoice ?? existing.mealChoice,
      notes: guest.notes ?? existing.notes
    };
    this.guests.set(id, updated);
    return updated;
  }

  async deleteGuest(id: number): Promise<boolean> {
    return this.guests.delete(id);
  }

  // Budget Management
  async getBudgetItems(): Promise<BudgetItem[]> {
    return Array.from(this.budgetItems.values());
  }

  async getBudgetItem(id: number): Promise<BudgetItem | undefined> {
    return this.budgetItems.get(id);
  }

  async createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem> {
    const id = this.budgetId++;
    const newItem: BudgetItem = {
      id,
      category: item.category,
      description: item.description,
      estimatedAmount: item.estimatedAmount,
      dueDate: item.dueDate ?? null,
      actualAmount: item.actualAmount ?? null,
      paid: item.paid ?? null,
      vendorId: item.vendorId ?? null,
      receiptImage: item.receiptImage ?? null
    };
    this.budgetItems.set(id, newItem);
    return newItem;
  }

  async updateBudgetItem(id: number, item: Partial<InsertBudgetItem>): Promise<BudgetItem | undefined> {
    const existing = this.budgetItems.get(id);
    if (!existing) return undefined;
    const updated: BudgetItem = {
      ...existing,
      ...item,
      dueDate: item.dueDate ?? existing.dueDate,
      actualAmount: item.actualAmount ?? existing.actualAmount,
      paid: item.paid ?? existing.paid,
      vendorId: item.vendorId ?? existing.vendorId,
      receiptImage: item.receiptImage ?? existing.receiptImage
    };
    this.budgetItems.set(id, updated);
    return updated;
  }

  async deleteBudgetItem(id: number): Promise<boolean> {
    return this.budgetItems.delete(id);
  }

  // Task Management
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const newTask: Task = {
      id,
      title: task.title,
      description: task.description ?? null,
      dueDate: task.dueDate ?? null,
      completed: task.completed ?? null,
      priority: task.priority ?? null,
      category: task.category ?? null,
      assignedTo: task.assignedTo ?? null
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    const updated: Task = {
      ...existing,
      ...task,
      description: task.description ?? existing.description,
      dueDate: task.dueDate ?? existing.dueDate,
      completed: task.completed ?? existing.completed,
      priority: task.priority ?? existing.priority,
      category: task.category ?? existing.category,
      assignedTo: task.assignedTo ?? existing.assignedTo
    };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  // Vendor Management
  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const id = this.vendorId++;
    const newVendor: Vendor = {
      id,
      name: vendor.name,
      category: vendor.category,
      contactName: vendor.contactName ?? null,
      phone: vendor.phone ?? null,
      email: vendor.email ?? null,
      website: vendor.website ?? null,
      address: vendor.address ?? null,
      notes: vendor.notes ?? null,
      contractFile: vendor.contractFile ?? null
    };
    this.vendors.set(id, newVendor);
    return newVendor;
  }

  async updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const existing = this.vendors.get(id);
    if (!existing) return undefined;
    const updated: Vendor = {
      ...existing,
      ...vendor,
      contactName: vendor.contactName ?? existing.contactName,
      phone: vendor.phone ?? existing.phone,
      email: vendor.email ?? existing.email,
      website: vendor.website ?? existing.website,
      address: vendor.address ?? existing.address,
      notes: vendor.notes ?? existing.notes,
      contractFile: vendor.contractFile ?? existing.contractFile
    };
    this.vendors.set(id, updated);
    return updated;
  }

  async deleteVendor(id: number): Promise<boolean> {
    return this.vendors.delete(id);
  }

  // Appointment Management
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentId++;
    const newAppointment: Appointment = {
      id,
      title: appointment.title,
      vendorId: appointment.vendorId ?? null,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location ?? null,
      notes: appointment.notes ?? null,
      reminder: appointment.reminder ?? null
    };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existing = this.appointments.get(id);
    if (!existing) return undefined;
    const updated: Appointment = {
      ...existing,
      ...appointment,
      vendorId: appointment.vendorId ?? existing.vendorId,
      location: appointment.location ?? existing.location,
      notes: appointment.notes ?? existing.notes,
      reminder: appointment.reminder ?? existing.reminder
    };
    this.appointments.set(id, updated);
    return updated;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Seating Plan Management
  async getSeatingPlans(): Promise<SeatingPlan[]> {
    return Array.from(this.seatingPlans.values());
  }

  async getSeatingPlan(id: number): Promise<SeatingPlan | undefined> {
    return this.seatingPlans.get(id);
  }

  async createSeatingPlan(plan: InsertSeatingPlan): Promise<SeatingPlan> {
    const id = this.seatingPlanId++;
    const newPlan: SeatingPlan = {
      id,
      tableName: plan.tableName,
      capacity: plan.capacity,
      category: plan.category ?? null,
      location: plan.location ?? null
    };
    this.seatingPlans.set(id, newPlan);
    return newPlan;
  }

  async updateSeatingPlan(id: number, plan: Partial<InsertSeatingPlan>): Promise<SeatingPlan | undefined> {
    const existing = this.seatingPlans.get(id);
    if (!existing) return undefined;
    const updated: SeatingPlan = {
      ...existing,
      ...plan,
      category: plan.category ?? existing.category,
      location: plan.location ?? existing.location
    };
    this.seatingPlans.set(id, updated);
    return updated;
  }

  async deleteSeatingPlan(id: number): Promise<boolean> {
    return this.seatingPlans.delete(id);
  }

  // User Settings Management
  async getUserSettings(): Promise<UserSettings | undefined> {
    const settings = Array.from(this.userSettings.values());
    return settings.length > 0 ? settings[0] : undefined;
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const id = this.userSettingsId++;
    const newSettings: UserSettings = {
      id,
      weddingDate: settings.weddingDate ?? null,
      coupleNames: settings.coupleNames ?? null,
      venueAddress: settings.venueAddress ?? null,
      theme: settings.theme ?? null,
      isPremium: settings.isPremium ?? null
    };
    this.userSettings.set(id, newSettings);
    return newSettings;
  }

  async updateUserSettings(id: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const existing = this.userSettings.get(id);
    if (!existing) return undefined;
    const updated: UserSettings = {
      ...existing,
      ...settings,
      weddingDate: settings.weddingDate ?? existing.weddingDate,
      coupleNames: settings.coupleNames ?? existing.coupleNames,
      venueAddress: settings.venueAddress ?? existing.venueAddress,
      theme: settings.theme ?? existing.theme,
      isPremium: settings.isPremium ?? existing.isPremium
    };
    this.userSettings.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();