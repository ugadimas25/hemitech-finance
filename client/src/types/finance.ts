export interface Summary {
  totalCost: number;
  totalIncome: number;
  revenue: number;
  resourceCost: number;
  opexCost: number;
  capexCost: number;
}

export interface CapexItem {
  id: string;
  kategori: string;
  item: string;
  description: string;
  qty: number;
  hargaSatuan: number;
  total: number;
}

export interface OpexItem {
  id: string;
  kategori: string;
  item: string;
  totalBulanan: number;
  totalTahunan: number;
}

export interface Employee {
  id: string;
  level: string;
  role: string;
  qty: number;
  salaryMonth: number;
  totalSalaryMonth: number;
  totalSalaryYear: number;
  thrBenefit: number;
}

export interface RevenueStream {
  id: string;
  name: string;
  monthly: number;
  yearly: number;
}

export interface RevenueSummary {
  streams: RevenueStream[];
  totalMonthly: number;
  totalYearly: number;
}

export interface HemitechData {
  summary: Summary;
  capex: CapexItem[];
  opex: OpexItem[];
  employees: Employee[];
  revenue: RevenueSummary;
}

export interface CashflowProjectionParams {
  baseRevenue: number;
  baseCost: number;
  revenueGrowth: number;
  costGrowth: number;
  years: number;
}

export interface YearlyProjection {
  year: number;
  revenue: number;
  cost: number;
  netCashflow: number;
  cumulativeCash: number;
}
