// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel'; // Import the Vercel adapter

// https://astro.build/config
export default defineConfig({
  output: 'server', // Crucial: This tells Astro to build for server-side rendering, needed for API routes on Vercel.
  adapter: vercel(), // Use the Vercel adapter to optimize deployment for Vercel functions.
});