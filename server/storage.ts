import { 
  type Guest, type InsertGuest,
  type BudgetItem, type InsertBudgetItem,
  type Task, type InsertTask,
  type Vendor, type InsertVendor
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
}

export class MemStorage implements IStorage {
  private guests: Map<number, Guest>;
  private budgetItems: Map<number, BudgetItem>;
  private tasks: Map<number, Task>;
  private vendors: Map<number, Vendor>;
  private guestId: number;
  private budgetId: number;
  private taskId: number;
  private vendorId: number;

  constructor() {
    this.guests = new Map();
    this.budgetItems = new Map();
    this.tasks = new Map();
    this.vendors = new Map();
    this.guestId = 1;
    this.budgetId = 1;
    this.taskId = 1;
    this.vendorId = 1;
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
      paid: item.paid ?? null
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
      paid: item.paid ?? existing.paid
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
      priority: task.priority ?? null
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
      priority: task.priority ?? existing.priority
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
      email: vendor.email ?? null,
      phone: vendor.phone ?? null,
      website: vendor.website ?? null,
      address: vendor.address ?? null,
      notes: vendor.notes ?? null,
      appointmentDate: vendor.appointmentDate ?? null
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
      email: vendor.email ?? existing.email,
      phone: vendor.phone ?? existing.phone,
      website: vendor.website ?? existing.website,
      address: vendor.address ?? existing.address,
      notes: vendor.notes ?? existing.notes,
      appointmentDate: vendor.appointmentDate ?? existing.appointmentDate
    };
    this.vendors.set(id, updated);
    return updated;
  }

  async deleteVendor(id: number): Promise<boolean> {
    return this.vendors.delete(id);
  }
}

export const storage = new MemStorage();