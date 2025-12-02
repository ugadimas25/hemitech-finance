import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, decimal, timestamp, char } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// CAPEX Table
export const capex = mysqlTable("capex", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  kategori: text("kategori").notNull(),
  item: text("item").notNull(),
  description: text("description"),
  qty: int("qty").notNull().default(1),
  hargaSatuan: decimal("harga_satuan", { precision: 15, scale: 2 }).notNull(),
  total: decimal("total", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertCapexSchema = createInsertSchema(capex, {
  qty: z.number().int().positive(),
  hargaSatuan: z.string().or(z.number().positive()),
  total: z.string().or(z.number().positive()),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectCapexSchema = createSelectSchema(capex);
export type Capex = typeof capex.$inferSelect;
export type InsertCapex = z.infer<typeof insertCapexSchema>;

// OPEX Table
export const opex = mysqlTable("opex", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  kategori: text("kategori").notNull(),
  item: text("item").notNull(),
  totalBulanan: decimal("total_bulanan", { precision: 15, scale: 2 }).notNull(),
  totalTahunan: decimal("total_tahunan", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertOpexSchema = createInsertSchema(opex, {
  totalBulanan: z.string().or(z.number().positive()),
  totalTahunan: z.string().or(z.number().positive()),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectOpexSchema = createSelectSchema(opex);
export type Opex = typeof opex.$inferSelect;
export type InsertOpex = z.infer<typeof insertOpexSchema>;

// Employees Table
export const employees = mysqlTable("employees", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  level: text("level").notNull(),
  role: text("role").notNull(),
  qty: int("qty").notNull().default(1),
  salaryMonth: decimal("salary_month", { precision: 15, scale: 2 }).notNull(),
  totalSalaryMonth: decimal("total_salary_month", { precision: 15, scale: 2 }).notNull(),
  totalSalaryYear: decimal("total_salary_year", { precision: 15, scale: 2 }).notNull(),
  thrBenefit: decimal("thr_benefit", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertEmployeeSchema = createInsertSchema(employees, {
  qty: z.number().int().positive(),
  salaryMonth: z.string().or(z.number().positive()),
  totalSalaryMonth: z.string().or(z.number().positive()),
  totalSalaryYear: z.string().or(z.number().positive()),
  thrBenefit: z.string().or(z.number().positive()),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectEmployeeSchema = createSelectSchema(employees);
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

// Revenue Streams Table
export const revenueStreams = mysqlTable("revenue_streams", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  unitResidence: int("unit_residence").notNull().default(0),
  residence: int("residence").notNull().default(0),
  paymentGateway: decimal("payment_gateway", { precision: 15, scale: 2 }).default('0'),
  avgTransaction: int("avg_transaction").default(0),
  subscriptionPerMonth: decimal("subscription_per_month", { precision: 15, scale: 2 }).default('0'),
  monthly: decimal("monthly", { precision: 15, scale: 2 }).notNull(),
  yearly: decimal("yearly", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertRevenueStreamSchema = createInsertSchema(revenueStreams, {
  unitResidence: z.number().int().nonnegative().optional(),
  residence: z.number().int().nonnegative().optional(),
  paymentGateway: z.string().or(z.number()).optional(),
  avgTransaction: z.number().int().nonnegative().optional(),
  subscriptionPerMonth: z.string().or(z.number()).optional(),
  monthly: z.string().or(z.number().positive()),
  yearly: z.string().or(z.number().positive()),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectRevenueStreamSchema = createSelectSchema(revenueStreams);
export type RevenueStream = typeof revenueStreams.$inferSelect;
export type InsertRevenueStream = z.infer<typeof insertRevenueStreamSchema>;

// Summary/Dashboard Table (untuk menyimpan summary calculations)
export const financialSummary = mysqlTable("financial_summary", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  totalCost: decimal("total_cost", { precision: 15, scale: 2 }).notNull(),
  totalIncome: decimal("total_income", { precision: 15, scale: 2 }).notNull(),
  revenue: decimal("revenue", { precision: 15, scale: 2 }).notNull(),
  resourceCost: decimal("resource_cost", { precision: 15, scale: 2 }).notNull(),
  opexCost: decimal("opex_cost", { precision: 15, scale: 2 }).notNull(),
  capexCost: decimal("capex_cost", { precision: 15, scale: 2 }).notNull(),
  profit: decimal("profit", { precision: 15, scale: 2 }).notNull(),
  profitMargin: decimal("profit_margin", { precision: 5, scale: 2 }),
  period: text("period").notNull(), // e.g., "2025-Q1", "2025-12", "2025"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertFinancialSummarySchema = createInsertSchema(financialSummary, {
  totalCost: z.string().or(z.number()),
  totalIncome: z.string().or(z.number()),
  revenue: z.string().or(z.number()),
  resourceCost: z.string().or(z.number()),
  opexCost: z.string().or(z.number()),
  capexCost: z.string().or(z.number()),
  profit: z.string().or(z.number()),
  profitMargin: z.string().or(z.number()).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectFinancialSummarySchema = createSelectSchema(financialSummary);
export type FinancialSummary = typeof financialSummary.$inferSelect;
export type InsertFinancialSummary = z.infer<typeof insertFinancialSummarySchema>;

// Cashflow Projections Table
export const cashflowProjections = mysqlTable("cashflow_projections", {
  id: char("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  year: int("year").notNull(),
  revenue: decimal("revenue", { precision: 15, scale: 2 }).notNull(),
  cost: decimal("cost", { precision: 15, scale: 2 }).notNull(),
  netCashflow: decimal("net_cashflow", { precision: 15, scale: 2 }).notNull(),
  cumulativeCash: decimal("cumulative_cash", { precision: 15, scale: 2 }).notNull(),
  baseRevenue: decimal("base_revenue", { precision: 15, scale: 2 }),
  baseCost: decimal("base_cost", { precision: 15, scale: 2 }),
  revenueGrowth: decimal("revenue_growth", { precision: 5, scale: 2 }),
  costGrowth: decimal("cost_growth", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const insertCashflowProjectionSchema = createInsertSchema(cashflowProjections, {
  year: z.number().int().positive(),
  revenue: z.string().or(z.number()),
  cost: z.string().or(z.number()),
  netCashflow: z.string().or(z.number()),
  cumulativeCash: z.string().or(z.number()),
  baseRevenue: z.string().or(z.number()).optional(),
  baseCost: z.string().or(z.number()).optional(),
  revenueGrowth: z.string().or(z.number()).optional(),
  costGrowth: z.string().or(z.number()).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectCashflowProjectionSchema = createSelectSchema(cashflowProjections);
export type CashflowProjection = typeof cashflowProjections.$inferSelect;
export type InsertCashflowProjection = z.infer<typeof insertCashflowProjectionSchema>;
