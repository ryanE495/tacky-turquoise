import { defineCollection, z } from 'astro:content';

// Git-based markdown blog. Posts live in src/content/blog/*.md and build to
// static HTML. No Supabase, no admin UI. Strict Zod schema so the build FAILS
// on bad frontmatter.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Keep titles short enough for a clean <title> / SERP display.
    title: z.string().max(65),
    // This doubles as the meta description — enforce a real, useful length.
    description: z.string().min(70).max(160),
    // The target keyword from the spreadsheet, so overlap is greppable.
    targetKeyword: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    // Optional FAQ — renders visibly at the foot of the post AND emits FAQPage
    // JSON-LD. Keep the on-page questions and the schema in sync (same array).
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      )
      .default([]),
    // How a post links into the shop. price is left loosely typed on purpose
    // (hand-authored — "$180" or 180 both accepted).
    relatedProducts: z
      .array(
        z.object({
          title: z.string(),
          href: z.string(),
          price: z.union([z.string(), z.number()]).optional(),
          image: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { blog };
