-- Hapus data dummy dan masukkan data sebenarnya

-- ============================================
-- HAPUS DATA DUMMY
-- ============================================
DELETE FROM `capex`;
DELETE FROM `opex`;
DELETE FROM `employees`;
DELETE FROM `revenue_streams`;
DELETE FROM `cashflow_projections`;
DELETE FROM `financial_summary`;

-- ============================================
-- INSERT DATA CAPEX SEBENARNYA
-- ============================================
INSERT INTO `capex` (`id`, `kategori`, `item`, `description`, `qty`, `harga_satuan`, `total`) VALUES
(UUID(), 'Sewa Awal', 'DP + 1 Tahun Sewa', NULL, 1, 150000000.00, 150000000.00),
(UUID(), 'Renovasi & Interior', 'Furniture (Meja, Kursi, Rak)', NULL, 12, 2500000.00, 30000000.00),
(UUID(), 'Renovasi & Interior', 'Meeting Room Setup', NULL, 1, 5000000.00, 5000000.00),
(UUID(), 'Renovasi & Interior', 'Pantry Setup', NULL, 1, 5000000.00, 5000000.00),
(UUID(), 'Renovasi & Interior', 'Branding & Signage', NULL, 1, 50000000.00, 50000000.00),
(UUID(), 'Infrastruktur IT', 'Server', NULL, 1, 40000000.00, 40000000.00),
(UUID(), 'Infrastruktur IT', 'Database', NULL, 1, 100000000.00, 100000000.00),
(UUID(), 'Infrastruktur IT', 'Instalasi Jaringan', NULL, 1, 1000000.00, 1000000.00),
(UUID(), 'Infrastruktur IT', 'CCTV', NULL, 3, 1000000.00, 3000000.00),
(UUID(), 'Peralatan Kantor', 'Printer + Scanner', NULL, 1, 1000000.00, 1000000.00),
(UUID(), 'Peralatan Kantor', 'Whiteboard (3 Unit)', NULL, 3, 1000000.00, 3000000.00),
(UUID(), 'Peralatan Kantor', 'Proyektor / TV Meeting', NULL, 2, 5000000.00, 10000000.00),
(UUID(), 'Peralatan Kantor', 'Loker / Lemari', NULL, 2, 3000000.00, 6000000.00);

-- ============================================
-- INSERT DATA OPEX SEBENARNYA
-- ============================================
INSERT INTO `opex` (`id`, `kategori`, `item`, `total_bulanan`, `total_tahunan`) VALUES
(UUID(), 'Internet & Komunikasi', 'Internet Utama + Backup', 1500000.00, 18000000.00),
(UUID(), 'Utilities', 'Listrik + Air + Kebersihan', 9500000.00, 114000000.00),
(UUID(), 'Internet & Komunikasi', 'Mailbox', 500000.00, 6000000.00);

-- ============================================
-- INSERT DATA EMPLOYEES SEBENARNYA
-- ============================================
INSERT INTO `employees` (`id`, `level`, `role`, `qty`, `salary_month`, `total_salary_month`, `total_salary_year`, `thr_benefit`) VALUES
(UUID(), 'CEO', 'CEO', 1, 30000000.00, 30000000.00, 360000000.00, 25000000.00),
(UUID(), 'CTO', 'CTO', 1, 25000000.00, 25000000.00, 300000000.00, 20000000.00),
(UUID(), 'Frontend Developer', 'Frontend Developer', 1, 9000000.00, 9000000.00, 108000000.00, 9000000.00),
(UUID(), 'Backend Developer', 'Backend Developer', 1, 9000000.00, 9000000.00, 108000000.00, 3000000.00),
(UUID(), 'Mobile Developer', 'Mobile Developer', 1, 9000000.00, 9000000.00, 108000000.00, 3000000.00),
(UUID(), 'HR', 'HR', 1, 7000000.00, 7000000.00, 84000000.00, 2333333.33),
(UUID(), 'Finance', 'Finance', 1, 7000000.00, 7000000.00, 84000000.00, 2333333.33),
(UUID(), 'Operational', 'Operational', 2, 4000000.00, 8000000.00, 96000000.00, 1333333.33),
(UUID(), 'Sales (medium)', 'Sales (medium)', 2, 6000000.00, 12000000.00, 144000000.00, 2000000.00),
(UUID(), 'Sales (Junior)', 'Sales (Junior)', 3, 4000000.00, 12000000.00, 144000000.00, 1333333.33),
(UUID(), 'Public Relation', 'Public Relation', 1, 4000000.00, 4000000.00, 48000000.00, 1333333.33);

-- ============================================
-- INSERT DATA REVENUE STREAMS SEBENARNYA
-- ============================================
-- Revenue dari Payment Gateway: 20,000 unit × 100 residence × Rp1,500 × 2 transaksi/bulan = Rp6,000,000,000/bulan
INSERT INTO `revenue_streams` (`id`, `name`, `monthly`, `yearly`) VALUES
(UUID(), 'Payment Gateway', 60000000.00, 720000000.00);

-- Revenue dari Subscription: 20,000 unit × 100 residence × Rp10,000 = Rp20,000,000,000/bulan
INSERT INTO `revenue_streams` (`id`, `name`, `monthly`, `yearly`) VALUES
(UUID(), 'Subscription', 200000000.00, 2400000000.00);

-- ============================================
-- SUMMARY (Optional - untuk referensi)
-- ============================================
-- Total CAPEX: Rp404,000,000
-- Total OPEX per tahun: Rp138,000,000
-- Total Employee Cost per tahun (gaji + THR):
--   - Total Gaji/tahun: Rp1,584,000,000
--   - Total THR: Rp70,666,666 (dihitung dari semua THR benefit)
--   - Total Employee Cost: Rp1,654,666,666
-- Total Revenue per tahun: Rp3,120,000,000
-- 
-- Total Cost = CAPEX + OPEX + Employee = 404,000,000 + 138,000,000 + 1,654,666,666 = Rp2,196,666,666
-- Total Revenue = Rp3,120,000,000
-- Profit = Revenue - Total Cost = Rp923,333,334
-- Profit Margin = (923,333,334 / 3,120,000,000) × 100 = 29.59%
