// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: "https://infosis.rapido.com.bo",
  output: "server",
  adapter: vercel(),
});
