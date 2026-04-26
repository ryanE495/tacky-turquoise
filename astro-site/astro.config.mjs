import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tackyturquoise.com',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/api/') &&
        !page.includes('/order/success') &&
        !page.includes('/order/failed') &&
        !page.includes('/checkout') &&
        !page.includes('/cart'),
    }),
  ],
});
