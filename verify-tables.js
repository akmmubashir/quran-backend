const { createConnection } = require('typeorm');
require('dotenv').config();

async function verifyTables() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: false,
    });

    const tables = ['ayah_groups', 'ayah_tafsir', 'ayah_translation', 'ayah_info'];
    
    console.log('Checking for tables in database...\n');
    
    for (const table of tables) {
      const result = await connection.query(`
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_name = '${table}'
      `);
      const exists = result[0].count > 0;
      console.log(`✓ ${table}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    }

    // Show all tables in public schema
    const allTables = await connection.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    
    console.log('\nAll tables in database:');
    allTables.forEach(t => console.log(`  - ${t.table_name}`));

    await connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyTables();
