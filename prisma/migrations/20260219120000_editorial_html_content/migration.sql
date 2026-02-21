-- AlterTable Article: editorial platform (HTML content, readTime, toc, featured)
ALTER TABLE "Article" ADD COLUMN "readTime" INTEGER;
ALTER TABLE "Article" ADD COLUMN "toc" JSONB;
ALTER TABLE "Article" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Article" ALTER COLUMN "image" DROP NOT NULL;
ALTER TABLE "Article" ALTER COLUMN "excerpt" DROP NOT NULL;
ALTER TABLE "Article" ALTER COLUMN "content" SET DATA TYPE TEXT USING (COALESCE("content"::text, ''));