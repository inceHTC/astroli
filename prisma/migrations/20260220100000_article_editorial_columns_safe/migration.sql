-- Add Article editorial columns if missing (safe to run; PostgreSQL 9.6+)
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "readTime" INTEGER;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "toc" JSONB;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false;
