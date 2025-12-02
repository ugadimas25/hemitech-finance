import 'dotenv/config';
import { pool } from './server/db';

async function updateRevenueData() {
  console.log('🔄 Updating revenue_streams table with detailed data...');
  
  try {
    // First, add the new columns if they don't exist
    console.log('Adding new columns to revenue_streams table...');
    
    const alterQueries = [
      'ALTER TABLE revenue_streams ADD COLUMN unit_residence INT DEFAULT 0',
      'ALTER TABLE revenue_streams ADD COLUMN residence INT DEFAULT 0',
      'ALTER TABLE revenue_streams ADD COLUMN payment_gateway DECIMAL(15,2) DEFAULT 0',
      'ALTER TABLE revenue_streams ADD COLUMN avg_transaction INT DEFAULT 0',
      'ALTER TABLE revenue_streams ADD COLUMN subscription_per_month DECIMAL(15,2) DEFAULT 0',
    ];
    
    for (const query of alterQueries) {
      try {
        await pool.query(query);
        console.log(`✓ ${query.split('ADD COLUMN ')[1].split(' ')[0]} added`);
      } catch (err: any) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`✓ ${query.split('ADD COLUMN ')[1].split(' ')[0]} already exists`);
        } else {
          throw err;
        }
      }
    }
    
    console.log('✅ Columns added/verified');
    
    // Update existing revenue records with detailed information
    console.log('Updating revenue records...');
    
    // Update Payment Gateway
    await pool.query(`
      UPDATE revenue_streams 
      SET 
        unit_residence = 20000,
        residence = 100,
        payment_gateway = 1500,
        avg_transaction = 2,
        subscription_per_month = 0,
        monthly = 60000000,
        yearly = 720000000
      WHERE name = 'Payment Gateway'
    `);
    
    // Update Subscription
    await pool.query(`
      UPDATE revenue_streams 
      SET 
        unit_residence = 20000,
        residence = 100,
        payment_gateway = 0,
        avg_transaction = 0,
        subscription_per_month = 10000,
        monthly = 200000000,
        yearly = 2400000000
      WHERE name = 'Subscription'
    `);
    
    console.log('✅ Revenue records updated successfully!');
    
    // Verify the updates
    const [rows] = await pool.query('SELECT * FROM revenue_streams');
    console.log('\n📊 Current revenue data:');
    console.log(rows);
    
    console.log('\n✅ All done! Revenue data updated successfully.');
    
  } catch (error) {
    console.error('❌ Error updating revenue data:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

updateRevenueData();
