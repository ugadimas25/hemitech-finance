import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";

async function insertRealData() {
  console.log("Connecting to database...");
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || "3306"),
      database: process.env.DB_DATABASE!,
      user: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD || ""
    });
    
    console.log("✓ Connected to database");
    
    // Hapus data dummy
    console.log("\nDeleting dummy data...");
    await connection.query("DELETE FROM `capex`");
    await connection.query("DELETE FROM `opex`");
    await connection.query("DELETE FROM `employees`");
    await connection.query("DELETE FROM `revenue_streams`");
    await connection.query("DELETE FROM `cashflow_projections`");
    await connection.query("DELETE FROM `financial_summary`");
    console.log("✓ Deleted all dummy data");
    
    // Insert CAPEX data
    console.log("\nInserting CAPEX data...");
    await connection.query(`
      INSERT INTO \`capex\` (\`id\`, \`kategori\`, \`item\`, \`description\`, \`qty\`, \`harga_satuan\`, \`total\`) VALUES
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
      (UUID(), 'Peralatan Kantor', 'Loker / Lemari', NULL, 2, 3000000.00, 6000000.00)
    `);
    console.log("✓ Inserted CAPEX data (13 items)");
    
    // Insert OPEX data
    console.log("\nInserting OPEX data...");
    await connection.query(`
      INSERT INTO \`opex\` (\`id\`, \`kategori\`, \`item\`, \`total_bulanan\`, \`total_tahunan\`) VALUES
      (UUID(), 'Internet & Komunikasi', 'Internet Utama + Backup', 1500000.00, 18000000.00),
      (UUID(), 'Utilities', 'Listrik + Air + Kebersihan', 9500000.00, 114000000.00),
      (UUID(), 'Internet & Komunikasi', 'Mailbox', 500000.00, 6000000.00)
    `);
    console.log("✓ Inserted OPEX data (3 items)");
    
    // Insert Employees data
    console.log("\nInserting Employees data...");
    await connection.query(`
      INSERT INTO \`employees\` (\`id\`, \`level\`, \`role\`, \`qty\`, \`salary_month\`, \`total_salary_month\`, \`total_salary_year\`, \`thr_benefit\`) VALUES
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
      (UUID(), 'Public Relation', 'Public Relation', 1, 4000000.00, 4000000.00, 48000000.00, 1333333.33)
    `);
    console.log("✓ Inserted Employees data (11 positions)");
    
    // Insert Revenue Streams data
    console.log("\nInserting Revenue Streams data...");
    await connection.query(`
      INSERT INTO \`revenue_streams\` (\`id\`, \`name\`, \`monthly\`, \`yearly\`) VALUES
      (UUID(), 'Payment Gateway', 60000000.00, 720000000.00),
      (UUID(), 'Subscription', 200000000.00, 2400000000.00)
    `);
    console.log("✓ Inserted Revenue Streams data (2 streams)");
    
    // Verify data
    console.log("\n=== Verification ===");
    const [capexCount] = await connection.query("SELECT COUNT(*) as count FROM `capex`");
    const [opexCount] = await connection.query("SELECT COUNT(*) as count FROM `opex`");
    const [empCount] = await connection.query("SELECT COUNT(*) as count FROM `employees`");
    const [revCount] = await connection.query("SELECT COUNT(*) as count FROM `revenue_streams`");
    
    console.log(`CAPEX records: ${(capexCount as any)[0].count}`);
    console.log(`OPEX records: ${(opexCount as any)[0].count}`);
    console.log(`Employees records: ${(empCount as any)[0].count}`);
    console.log(`Revenue Streams records: ${(revCount as any)[0].count}`);
    
    // Calculate summary
    console.log("\n=== Financial Summary ===");
    const [capexTotal] = await connection.query("SELECT SUM(total) as total FROM `capex`");
    const [opexTotal] = await connection.query("SELECT SUM(total_tahunan) as total FROM `opex`");
    const [empTotal] = await connection.query("SELECT SUM(total_salary_year + thr_benefit) as total FROM `employees`");
    const [revTotal] = await connection.query("SELECT SUM(yearly) as total FROM `revenue_streams`");
    
    const totalCapex = Number((capexTotal as any)[0].total);
    const totalOpex = Number((opexTotal as any)[0].total);
    const totalEmployeeCost = Number((empTotal as any)[0].total);
    const totalRevenue = Number((revTotal as any)[0].total);
    const totalCost = totalCapex + totalOpex + totalEmployeeCost;
    const profit = totalRevenue - totalCost;
    const profitMargin = (profit / totalRevenue) * 100;
    
    console.log(`Total CAPEX: Rp${totalCapex.toLocaleString('id-ID')}`);
    console.log(`Total OPEX (yearly): Rp${totalOpex.toLocaleString('id-ID')}`);
    console.log(`Total Employee Cost (yearly): Rp${totalEmployeeCost.toLocaleString('id-ID')}`);
    console.log(`Total Cost: Rp${totalCost.toLocaleString('id-ID')}`);
    console.log(`Total Revenue (yearly): Rp${totalRevenue.toLocaleString('id-ID')}`);
    console.log(`Profit: Rp${profit.toLocaleString('id-ID')}`);
    console.log(`Profit Margin: ${profitMargin.toFixed(2)}%`);
    
    console.log("\n✅ Real data inserted successfully!");
    
    await connection.end();
  } catch (error) {
    console.error("❌ Error inserting data:", error);
    process.exit(1);
  }
}

insertRealData();
