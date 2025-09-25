// src/env.d.ts

/// <reference types="astro/client" />
// This line tells TypeScript to include Astro's client-side type definitions.

// Declare the structure of environment variables that will be available via `import.meta.env`.
interface ImportMetaEnv {
  readonly DATABASE_URL: string;      // The URL for connecting to our Postgres database.
  readonly TELEGRAM_BOT_TOKEN: string; // The token for our Telegram bot (from BotFather).
  readonly JWT_SECRET: string;        // A secret key for signing our session cookies securely.
}

// Extend the ImportMeta interface to include our custom environment variables.
interface ImportMeta {
  readonly env: ImportMetaEnv;
}