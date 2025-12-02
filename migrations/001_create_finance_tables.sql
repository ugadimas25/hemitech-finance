-- Migration: Create Finance Tables for MySQL
-- Created: 2025-12-02

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- CAPEX Table
CREATE TABLE IF NOT EXISTS capex (
  id CHAR(36) PRIMARY KEY,
  kategori TEXT NOT NULL,
  item TEXT NOT NULL,
  description TEXT,
  qty INT NOT NULL DEFAULT 1,
  harga_satuan DECIMAL(15, 2) NOT NULL,
  total DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_capex_kategori (kategori(255)),
  INDEX idx_capex_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OPEX Table
CREATE TABLE IF NOT EXISTS opex (
  id CHAR(36) PRIMARY KEY,
  kategori TEXT NOT NULL,
  item TEXT NOT NULL,
  total_bulanan DECIMAL(15, 2) NOT NULL,
  total_tahunan DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_opex_kategori (kategori(255)),
  INDEX idx_opex_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id CHAR(36) PRIMARY KEY,
  level TEXT NOT NULL,
  role TEXT NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  salary_month DECIMAL(15, 2) NOT NULL,
  total_salary_month DECIMAL(15, 2) NOT NULL,
  total_salary_year DECIMAL(15, 2) NOT NULL,
  thr_benefit DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_employees_level (level(255)),
  INDEX idx_employees_role (role(255)),
  INDEX idx_employees_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Revenue Streams Table
CREATE TABLE IF NOT EXISTS revenue_streams (
  id CHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  monthly DECIMAL(15, 2) NOT NULL,
  yearly DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_revenue_streams_name (name(255)),
  INDEX idx_revenue_streams_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Financial Summary Table
CREATE TABLE IF NOT EXISTS financial_summary (
  id CHAR(36) PRIMARY KEY,
  total_cost DECIMAL(15, 2) NOT NULL,
  total_income DECIMAL(15, 2) NOT NULL,
  revenue DECIMAL(15, 2) NOT NULL,
  resource_cost DECIMAL(15, 2) NOT NULL,
  opex_cost DECIMAL(15, 2) NOT NULL,
  capex_cost DECIMAL(15, 2) NOT NULL,
  profit DECIMAL(15, 2) NOT NULL,
  profit_margin DECIMAL(5, 2),
  period TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_financial_summary_period (period(255)),
  INDEX idx_financial_summary_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cashflow Projections Table
CREATE TABLE IF NOT EXISTS cashflow_projections (
  id CHAR(36) PRIMARY KEY,
  year INT NOT NULL,
  revenue DECIMAL(15, 2) NOT NULL,
  cost DECIMAL(15, 2) NOT NULL,
  net_cashflow DECIMAL(15, 2) NOT NULL,
  cumulative_cash DECIMAL(15, 2) NOT NULL,
  base_revenue DECIMAL(15, 2),
  base_cost DECIMAL(15, 2),
  revenue_growth DECIMAL(5, 2),
  cost_growth DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cashflow_projections_year (year),
  INDEX idx_cashflow_projections_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
