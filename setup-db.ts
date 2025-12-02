import "dotenv/config";
import mysql from "mysql2/promise";

async function setupDatabase() {
  console.log("Connecting to database...");
  console.log("Host:", process.env.DB_HOST);
  console.log("Database:", process.env.DB_DATABASE);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || "3306"),
      database: process.env.DB_DATABASE!,
      user: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD || ""
    });
    
    console.log("✓ Connected to database");
    
    // Check existing tables
    const [tables] = await connection.query("SHOW TABLES");
    console.log("\nExisting tables:", tables);
    
    // Create tables
    console.log("\nCreating tables...");
    
    // CAPEX Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`capex\` (
        \`id\` CHAR(36) PRIMARY KEY,
        \`kategori\` TEXT NOT NULL,
        \`item\` TEXT NOT NULL,
        \`description\` TEXT,
        \`qty\` INT NOT NULL DEFAULT 1,
        \`harga_satuan\` DECIMAL(15, 2) NOT NULL,
        \`total\` DECIMAL(15, 2) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY \`idx_capex_kategori\` (\`kategori\`(255)),
        KEY \`idx_capex_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Created capex table");
    
    // OPEX Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`opex\` (
        \`id\` CHAR(36) PRIMARY KEY,
        \`kategori\` TEXT NOT NULL,
        \`item\` TEXT NOT NULL,
        \`total_bulanan\` DECIMAL(15, 2) NOT NULL,
        \`total_tahunan\` DECIMAL(15, 2) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY \`idx_opex_kategori\` (\`kategori\`(255)),
        KEY \`idx_opex_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Created opex table");
    
    // Employees Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`employees\` (
        \`id\` CHAR(36) PRIMARY KEY,
        \`level\` TEXT NOT NULL,
        \`role\` TEXT NOT NULL,
        \`qty\` INT NOT NULL DEFAULT 1,
        \`salary_month\` DECIMAL(15, 2) NOT NULL,
        \`total_salary_month\` DECIMAL(15, 2) NOT NULL,
        \`total_salary_year\` DECIMAL(15, 2) NOT NULL,
        \`thr_benefit\` DECIMAL(15, 2) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY \`idx_employees_level\` (\`level\`(255)),
        KEY \`idx_employees_role\` (\`role\`(255)),
        KEY \`idx_employees_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Created employees table");
    
    // Revenue Streams Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`revenue_streams\` (
        \`id\` CHAR(36) PRIMARY KEY,
        \`name\` TEXT NOT NULL,
        \`monthly\` DECIMAL(15, 2) NOT NULL,
        \`yearly\` DECIMAL(15, 2) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY \`idx_revenue_streams_name\` (\`name\`(255)),
        KEY \`idx_revenue_streams_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Created revenue_streams table");
    
    // Financial Summary Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`financial_summary\` (
        \`id\` CHAR(36) PRIMARY KEY,
        \`total_cost\` DECIMAL(15, 2) NOT NULL,
        \`total_income\` DECIMAL(15, 2) NOT NULL,
        \`revenue\` DECIMAL(15, 2) NOT NULL,
        \`resource_cost\` DECIMAL(15, 2) NOT NULL,
        \`opex_cost\` DECIMAL(15, 2) NOT NULL,
        \`capex_cost\` DECIMAL(15, 2) NOT NULL,
        \`profit\` DECIMAL(15, 2) NOT NULL,
        \`profit_margin\` DECIMAL(5, 2),
        \`period\` TEXT NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY \`idx_financial_summary_period\` (\`period\`(255)),
        KEY \`idx_financial_summary_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Created financial_summary table");
    
    // Cashflow Projections Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`cashflow_projections\` (
        \`id\` CHAR(36) PRIMARY KEY,
        \`year\` INT NOT NULL,
        \`revenue\` DECIMAL(15, 2) NOT NULL,
        \`cost\` DECIMAL(15, 2) NOT NULL,
        \`net_cashflow\` DECIMAL(15, 2) NOT NULL,
        \`cumulative_cash\` DECIMAL(15, 2) NOT NULL,
        \`base_revenue\` DECIMAL(15, 2),
        \`base_cost\` DECIMAL(15, 2),
        \`revenue_growth\` DECIMAL(5, 2),
        \`cost_growth\` DECIMAL(5, 2),
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY \`idx_cashflow_projections_year\` (\`year\`),
        KEY \`idx_cashflow_projections_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Created cashflow_projections table");
    
    // Check tables again
    const [newTables] = await connection.query("SHOW TABLES");
    console.log("\nTables after creation:", newTables);
    
    // Insert sample data
    console.log("\nInserting sample data...");
    
    await connection.query(`
      INSERT IGNORE INTO \`capex\` (\`id\`, \`kategori\`, \`item\`, \`description\`, \`qty\`, \`harga_satuan\`, \`total\`) VALUES
      (UUID(), 'Hardware', 'Server Dell PowerEdge', 'Production server', 2, 50000000.00, 100000000.00),
      (UUID(), 'Software', 'Microsoft Office License', 'Office suite for 10 users', 10, 5000000.00, 50000000.00),
      (UUID(), 'Furniture', 'Office Desks', 'Standing desks', 15, 3000000.00, 45000000.00)
    `);
    console.log("✓ Inserted capex data");
    
    await connection.query(`
      INSERT IGNORE INTO \`opex\` (\`id\`, \`kategori\`, \`item\`, \`total_bulanan\`, \`total_tahunan\`) VALUES
      (UUID(), 'Office', 'Sewa Kantor', 25000000.00, 300000000.00),
      (UUID(), 'Utilities', 'Listrik & Air', 5000000.00, 60000000.00),
      (UUID(), 'Internet', 'Internet & Telekomunikasi', 3000000.00, 36000000.00),
      (UUID(), 'Maintenance', 'Pemeliharaan Rutin', 2000000.00, 24000000.00)
    `);
    console.log("✓ Inserted opex data");
    
    await connection.query(`
      INSERT IGNORE INTO \`employees\` (\`id\`, \`level\`, \`role\`, \`qty\`, \`salary_month\`, \`total_salary_month\`, \`total_salary_year\`, \`thr_benefit\`) VALUES
      (UUID(), 'Senior', 'Software Engineer', 3, 15000000.00, 45000000.00, 540000000.00, 45000000.00),
      (UUID(), 'Mid', 'Product Manager', 2, 12000000.00, 24000000.00, 288000000.00, 24000000.00),
      (UUID(), 'Junior', 'QA Engineer', 2, 8000000.00, 16000000.00, 192000000.00, 16000000.00),
      (UUID(), 'Senior', 'DevOps Engineer', 1, 16000000.00, 16000000.00, 192000000.00, 16000000.00)
    `);
    console.log("✓ Inserted employees data");
    
    await connection.query(`
      INSERT IGNORE INTO \`revenue_streams\` (\`id\`, \`name\`, \`monthly\`, \`yearly\`) VALUES
      (UUID(), 'Subscription Revenue', 150000000.00, 1800000000.00),
      (UUID(), 'Consulting Services', 75000000.00, 900000000.00),
      (UUID(), 'Training Programs', 25000000.00, 300000000.00),
      (UUID(), 'Support & Maintenance', 50000000.00, 600000000.00)
    `);
    console.log("✓ Inserted revenue streams data");
    
    await connection.query(`
      INSERT IGNORE INTO \`cashflow_projections\` (\`id\`, \`year\`, \`revenue\`, \`cost\`, \`net_cashflow\`, \`cumulative_cash\`, \`base_revenue\`, \`base_cost\`, \`revenue_growth\`, \`cost_growth\`) VALUES
      (UUID(), 2025, 3600000000.00, 1695000000.00, 1905000000.00, 1905000000.00, 3600000000.00, 1695000000.00, 15.00, 8.00),
      (UUID(), 2026, 4140000000.00, 1830600000.00, 2309400000.00, 4214400000.00, 3600000000.00, 1695000000.00, 15.00, 8.00),
      (UUID(), 2027, 4761000000.00, 1977048000.00, 2783952000.00, 6998352000.00, 3600000000.00, 1695000000.00, 15.00, 8.00)
    `);
    console.log("✓ Inserted cashflow projections data");
    
    console.log("\n✅ Database setup completed successfully!");
    
    await connection.end();
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
