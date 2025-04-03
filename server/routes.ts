import { Express } from "express";
import { createServer, Server } from "http";
import { storage } from "./storage";
import { insertGuestSchema, insertBudgetItemSchema, insertTaskSchema, insertVendorSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });
  // Guest Routes
  app.get("/api/guests", async (_req, res) => {
    const guests = await storage.getGuests();
    res.json(guests);
  });

  app.post("/api/guests", async (req, res) => {
    const result = insertGuestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const guest = await storage.createGuest(result.data);
    res.status(201).json(guest);
  });

  app.patch("/api/guests/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertGuestSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const guest = await storage.updateGuest(id, result.data);
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.json(guest);
  });

  app.delete("/api/guests/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteGuest(id);
    if (!success) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.status(204).end();
  });

  // Budget Routes
  app.get("/api/budget", async (_req, res) => {
    const items = await storage.getBudgetItems();
    res.json(items);
  });

  app.post("/api/budget", async (req, res) => {
    const result = insertBudgetItemSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const item = await storage.createBudgetItem(result.data);
    res.status(201).json(item);
  });

  app.patch("/api/budget/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertBudgetItemSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const item = await storage.updateBudgetItem(id, result.data);
    if (!item) {
      return res.status(404).json({ error: "Budget item not found" });
    }
    res.json(item);
  });

  app.delete("/api/budget/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteBudgetItem(id);
    if (!success) {
      return res.status(404).json({ error: "Budget item not found" });
    }
    res.status(204).end();
  });

  // Task Routes
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const task = await storage.createTask(result.data);
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertTaskSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const task = await storage.updateTask(id, result.data);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteTask(id);
    if (!success) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).end();
  });

  // Vendor Routes
  app.get("/api/vendors", async (_req, res) => {
    const vendors = await storage.getVendors();
    res.json(vendors);
  });

  app.post("/api/vendors", async (req, res) => {
    const result = insertVendorSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const vendor = await storage.createVendor(result.data);
    res.status(201).json(vendor);
  });

  app.patch("/api/vendors/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertVendorSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const vendor = await storage.updateVendor(id, result.data);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(vendor);
  });

  app.delete("/api/vendors/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteVendor(id);
    if (!success) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}