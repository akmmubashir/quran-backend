import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...\n');

    // Step 1: Reset Prisma migrations
    console.log('📝 Resetting migration history...');
    try {
      await execAsync('npx prisma migrate reset --force', {
        cwd: path.resolve(__dirname, '..'),
      });
      console.log('✅ Migration reset complete\n');
    } catch (error) {
      console.log('⚠️  Could not reset with migrate reset, trying manual approach...\n');

      // Manual approach: delete all migration files except the first one
      const migrationsDir = path.resolve(__dirname, '../prisma/migrations');
      const migrations = fs.readdirSync(migrationsDir).filter(f => {
        return fs.statSync(path.join(migrationsDir, f)).isDirectory();
      });

      console.log(`Found ${migrations.length} migrations`);

      // Keep only the initial migration
      for (const migration of migrations) {
        if (migration !== '20251110143357_init') {
          const migrationPath = path.join(migrationsDir, migration);
          fs.rmSync(migrationPath, { recursive: true, force: true });
          console.log(`Deleted migration: ${migration}`);
        }
      }
    }

    // Step 2: Drop and recreate database
    console.log('\n🗑️  Dropping database...');
    try {
      await execAsync(
        'psql -U postgres -h localhost -p 5433 -c "DROP DATABASE IF EXISTS quran;"',
      );
      console.log('✅ Database dropped\n');
    } catch (error) {
      console.warn('⚠️  Could not drop database directly');
    }

    // Step 3: Regenerate Prisma Client
    console.log('🔧 Regenerating Prisma Client...');
    await execAsync('npx prisma generate', {
      cwd: path.resolve(__dirname, '..'),
    });
    console.log('✅ Prisma Client regenerated\n');

    // Step 4: Run migrations
    console.log('📊 Running migrations...');
    await execAsync('npx prisma migrate deploy', {
      cwd: path.resolve(__dirname, '..'),
    });
    console.log('✅ Migrations complete\n');

    // Step 5: Run seed
    console.log('🌱 Running seed script...');
    await execAsync('npx prisma db seed', {
      cwd: path.resolve(__dirname, '..'),
    });
    console.log('✅ Database seeded\n');

    console.log('🎉 Database reset complete! You can now run `npm run start:dev`');
  } catch (error) {
    console.error('❌ Error during reset:', error);
    process.exit(1);
  }
}

resetDatabase();
