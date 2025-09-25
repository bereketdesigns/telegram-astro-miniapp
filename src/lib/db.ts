// src/lib/db.ts
// This file sets up our database connection using the Vercel Postgres client.

import { sql } from '@vercel/postgres'; // Import the 'sql' function from the Vercel Postgres client.
                                        // This 'sql' function is a template tag that allows us to write
                                        // SQL queries safely (it handles parameter sanitization).

// We export the 'sql' client directly for convenience.
// This allows other parts of our application (like API routes) to import `sql`
// and immediately use it to interact with the database.
export { sql };