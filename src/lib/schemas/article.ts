import { z } from "zod";

const tocItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  level: z.number(),
});

export const createArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  tag: z.string().min(1),
  image: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  content: z.string(),
  readTime: z.number().int().min(0).optional().nullable(),
  toc: z.array(tocItemSchema).optional().nullable(),
  published: z.boolean(),
  featured: z.boolean().optional(),
});

export const updateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  tag: z.string().min(1).optional(),
  image: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional(),
  readTime: z.number().int().min(0).optional().nullable(),
  toc: z.array(tocItemSchema).optional().nullable(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});
