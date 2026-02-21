import { z } from "zod";

const ZODIAC_IDS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
] as const;

export const createCelebritySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  job: z.string().min(1),
  zodiac: z.enum(ZODIAC_IDS),
  image: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  featured: z.boolean(),
});

export const updateCelebritySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  job: z.string().min(1).optional(),
  zodiac: z.enum(ZODIAC_IDS).optional(),
  image: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  featured: z.boolean().optional(),
});
