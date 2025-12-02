import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { capex, opex, employees, revenueStreams, financialSummary, cashflowProjections } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // API Routes for Finance Data

  // ============= CAPEX ROUTES =============
  app.get("/api/capex", async (req, res) => {
    try {
      const data = await db.select().from(capex).orderBy(desc(capex.createdAt));
      res.json(data);
    } catch (error) {
      console.error("Error fetching capex:", error);
      res.status(500).json({ error: "Failed to fetch CAPEX data" });
    }
  });

  app.post("/api/capex", async (req, res) => {
    try {
      const newCapex = await db.insert(capex).values({
        id: crypto.randomUUID(),
        ...req.body,
      });
      res.json(newCapex);
    } catch (error) {
      console.error("Error creating capex:", error);
      res.status(500).json({ error: "Failed to create CAPEX" });
    }
  });

  app.delete("/api/capex/:id", async (req, res) => {
    try {
      await db.delete(capex).where(eq(capex.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting capex:", error);
      res.status(500).json({ error: "Failed to delete CAPEX" });
    }
  });

  // ============= OPEX ROUTES =============
  app.get("/api/opex", async (req, res) => {
    try {
      const data = await db.select().from(opex).orderBy(desc(opex.createdAt));
      res.json(data);
    } catch (error) {
      console.error("Error fetching opex:", error);
      res.status(500).json({ error: "Failed to fetch OPEX data" });
    }
  });

  app.post("/api/opex", async (req, res) => {
    try {
      const newOpex = await db.insert(opex).values({
        id: crypto.randomUUID(),
        ...req.body,
      });
      res.json(newOpex);
    } catch (error) {
      console.error("Error creating opex:", error);
      res.status(500).json({ error: "Failed to create OPEX" });
    }
  });

  app.delete("/api/opex/:id", async (req, res) => {
    try {
      await db.delete(opex).where(eq(opex.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting opex:", error);
      res.status(500).json({ error: "Failed to delete OPEX" });
    }
  });

  // ============= EMPLOYEES ROUTES =============
  app.get("/api/employees", async (req, res) => {
    try {
      const data = await db.select().from(employees).orderBy(desc(employees.createdAt));
      res.json(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees data" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const newEmployee = await db.insert(employees).values({
        id: crypto.randomUUID(),
        ...req.body,
      });
      res.json(newEmployee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Failed to create employee" });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      await db.delete(employees).where(eq(employees.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  // ============= REVENUE STREAMS ROUTES =============
  app.get("/api/revenue", async (req, res) => {
    try {
      const data = await db.select().from(revenueStreams).orderBy(desc(revenueStreams.createdAt));
      res.json(data);
    } catch (error) {
      console.error("Error fetching revenue:", error);
      res.status(500).json({ error: "Failed to fetch revenue data" });
    }
  });

  app.post("/api/revenue", async (req, res) => {
    try {
      const newRevenue = await db.insert(revenueStreams).values({
        id: crypto.randomUUID(),
        ...req.body,
      });
      res.json(newRevenue);
    } catch (error) {
      console.error("Error creating revenue:", error);
      res.status(500).json({ error: "Failed to create revenue" });
    }
  });

  app.delete("/api/revenue/:id", async (req, res) => {
    try {
      await db.delete(revenueStreams).where(eq(revenueStreams.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting revenue:", error);
      res.status(500).json({ error: "Failed to delete revenue" });
    }
  });

  // ============= FINANCIAL SUMMARY ROUTES =============
  app.get("/api/summary", async (req, res) => {
    try {
      // Get latest summary or calculate from current data
      const summaries = await db.select().from(financialSummary).orderBy(desc(financialSummary.createdAt)).limit(1);
      
      if (summaries.length > 0) {
        res.json(summaries[0]);
      } else {
        // Calculate summary from current data
        const allCapex = await db.select().from(capex);
        const allOpex = await db.select().from(opex);
        const allEmployees = await db.select().from(employees);
        const allRevenue = await db.select().from(revenueStreams);

        const capexCost = allCapex.reduce((sum, item) => sum + Number(item.total), 0);
        const opexCost = allOpex.reduce((sum, item) => sum + Number(item.totalTahunan), 0);
        const resourceCost = allEmployees.reduce((sum, item) => sum + Number(item.totalSalaryYear) + Number(item.thrBenefit), 0);
        const revenue = allRevenue.reduce((sum, item) => sum + Number(item.yearly), 0);
        
        const totalCost = capexCost + opexCost + resourceCost;
        const profit = revenue - totalCost;
        const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

        const summary = {
          totalCost,
          totalIncome: revenue,
          revenue,
          resourceCost,
          opexCost,
          capexCost,
          profit,
          profitMargin: Number(profitMargin.toFixed(2)),
        };

        res.json(summary);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      res.status(500).json({ error: "Failed to fetch summary" });
    }
  });

  // ============= CASHFLOW PROJECTIONS ROUTES =============
  app.get("/api/cashflow", async (req, res) => {
    try {
      const data = await db.select().from(cashflowProjections).orderBy(cashflowProjections.year);
      res.json(data);
    } catch (error) {
      console.error("Error fetching cashflow:", error);
      res.status(500).json({ error: "Failed to fetch cashflow data" });
    }
  });

  app.post("/api/cashflow/generate", async (req, res) => {
    try {
      const { baseRevenue, baseCost, revenueGrowth, costGrowth, years } = req.body;
      
      const projections = [];
      let cumulativeCash = 0;

      for (let i = 0; i < years; i++) {
        const year = new Date().getFullYear() + i;
        const revenue = baseRevenue * Math.pow(1 + revenueGrowth / 100, i);
        const cost = baseCost * Math.pow(1 + costGrowth / 100, i);
        const netCashflow = revenue - cost;
        cumulativeCash += netCashflow;

        projections.push({
          id: crypto.randomUUID(),
          year,
          revenue: revenue.toFixed(2),
          cost: cost.toFixed(2),
          netCashflow: netCashflow.toFixed(2),
          cumulativeCash: cumulativeCash.toFixed(2),
          baseRevenue: baseRevenue.toFixed(2),
          baseCost: baseCost.toFixed(2),
          revenueGrowth: revenueGrowth.toFixed(2),
          costGrowth: costGrowth.toFixed(2),
        });
      }

      // Clear existing projections and insert new ones
      await db.delete(cashflowProjections);
      await db.insert(cashflowProjections).values(projections);

      res.json(projections);
    } catch (error) {
      console.error("Error generating cashflow:", error);
      res.status(500).json({ error: "Failed to generate cashflow projections" });
    }
  });

  // ============= DASHBOARD DATA (ALL IN ONE) =============
  app.get("/api/dashboard", async (req, res) => {
    try {
      const [allCapex, allOpex, allEmployees, allRevenue, allCashflow] = await Promise.all([
        db.select().from(capex).orderBy(desc(capex.createdAt)),
        db.select().from(opex).orderBy(desc(opex.createdAt)),
        db.select().from(employees).orderBy(desc(employees.createdAt)),
        db.select().from(revenueStreams).orderBy(desc(revenueStreams.createdAt)),
        db.select().from(cashflowProjections).orderBy(cashflowProjections.year),
      ]);

      // Calculate summary
      const capexCost = allCapex.reduce((sum, item) => sum + Number(item.total), 0);
      const opexCost = allOpex.reduce((sum, item) => sum + Number(item.totalTahunan), 0);
      const resourceCost = allEmployees.reduce((sum, item) => sum + Number(item.totalSalaryYear) + Number(item.thrBenefit), 0);
      const revenue = allRevenue.reduce((sum, item) => sum + Number(item.yearly), 0);
      
      const totalCost = capexCost + opexCost + resourceCost;
      const profit = revenue - totalCost;

      const summary = {
        totalCost,
        totalIncome: revenue,
        revenue,
        resourceCost,
        opexCost,
        capexCost,
      };

      res.json({
        summary,
        capex: allCapex,
        opex: allOpex,
        employees: allEmployees,
        revenue: {
          streams: allRevenue,
          totalMonthly: allRevenue.reduce((sum, item) => sum + Number(item.monthly), 0),
          totalYearly: revenue,
        },
        cashflow: allCashflow,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  return httpServer;
}
