import { z } from "zod";

export const createTestSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  description: z.string().min(1, "Açıklama gerekli"),
  duration: z.string().min(1, "Süre gerekli (örn: 5–6 dk)"),
  image: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  published: z.boolean().default(false),
});

export type CreateTestInput = z.infer<typeof createTestSchema>;
