import { 
  type Guest, type InsertGuest,
  type BudgetItem, type InsertBudgetItem,
  type Task, type InsertTask
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
}

export class MemStorage implements IStorage {
  private guests: Map<number, Guest>;
  private budgetItems: Map<number, BudgetItem>;
  private tasks: Map<number, Task>;
  private guestId: number;
  private budgetId: number;
  private taskId: number;

  constructor() {
    this.guests = new Map();
    this.budgetItems = new Map();
    this.tasks = new Map();
    this.guestId = 1;
    this.budgetId = 1;
    this.taskId = 1;
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
    const newGuest = { ...guest, id };
    this.guests.set(id, newGuest);
    return newGuest;
  }

  async updateGuest(id: number, guest: Partial<InsertGuest>): Promise<Guest | undefined> {
    const existing = this.guests.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...guest };
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
    const newItem = { ...item, id };
    this.budgetItems.set(id, newItem);
    return newItem;
  }

  async updateBudgetItem(id: number, item: Partial<InsertBudgetItem>): Promise<BudgetItem | undefined> {
    const existing = this.budgetItems.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...item };
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
    const newTask = { ...task, id };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...task };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
