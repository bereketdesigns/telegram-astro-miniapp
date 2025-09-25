// scripts/run-migrations.ts
// This script connects to the Vercel Postgres database and runs our SQL migration files.

import { sql } from '@vercel/postgres'; // Our Vercel Postgres client
import { readFileSync } from 'node:fs';  // Node.js module for reading files
import { join } from 'node:path';       // Node.js module for joining path segments
import 'dotenv/config';                 // Loads environment variables from .env into process.env

// scripts/run-migrations.ts
//console.log('DATABASE_URL from .env:', process.env.DATABASE_URL ? 'Loaded' : 'NOT LOADED'); // Add this line

async function runMigrations() {
  console.log('Starting database migrations...');

  try {
    // Read the SQL file for our first migration.
    // `process.cwd()` gets the current working directory (your project root).
    const migrationSql = readFileSync(join(process.cwd(), 'db/migrations/001_create_users_table.sql'), 'utf8');
    console.log('--- SQL to be executed ---');
    console.log(migrationSql);
    console.log('--------------------------');

    // Execute the SQL statement.
    // The `sql.query` method is used for raw SQL commands.
    await sql.query(migrationSql);
    console.log('Migration 001_create_users_table.sql executed successfully.');

    // It's good practice to explicitly end the database connection for scripts.
    await sql.end();
    console.log('Database connection closed.');

  } catch (error) {
    console.error('Error running migrations:', error);
    // If an error occurs, exit the script with a non-zero status code.
    process.exit(1);
  }
  console.log('Database migrations finished successfully.');
}

// Call the migration function to start the process.
runMigrations();