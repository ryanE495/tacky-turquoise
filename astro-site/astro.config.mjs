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
        !page.includes('/cart') &&
        !page.includes('/rss.xml') &&
        // Beaded jewelry is hidden for now — keep the beaded shop out of the
        // sitemap. (Beaded product pages are noindexed at the page level.)
        !page.includes('/shop'),
    }),
  ],
});
