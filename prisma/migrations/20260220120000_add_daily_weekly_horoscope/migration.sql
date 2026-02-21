-- CreateTable
CREATE TABLE "DailyHoroscope" (
    "id" TEXT NOT NULL,
    "zodiacId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyHoroscope_pkey" PRIMARY KEY ("id")
);

-- AlterTable: Yeni kolonları ekle (varsa hata vermez)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WeeklyHoroscope' AND column_name = 'health') THEN
        ALTER TABLE "WeeklyHoroscope" ADD COLUMN "health" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WeeklyHoroscope' AND column_name = 'money') THEN
        ALTER TABLE "WeeklyHoroscope" ADD COLUMN "money" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WeeklyHoroscope' AND column_name = 'work') THEN
        ALTER TABLE "WeeklyHoroscope" ADD COLUMN "work" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WeeklyHoroscope' AND column_name = 'summary') THEN
        ALTER TABLE "WeeklyHoroscope" ADD COLUMN "summary" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'WeeklyHoroscope' AND column_name = 'updatedAt') THEN
        ALTER TABLE "WeeklyHoroscope" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- AlterTable: Eski kolonları kaldır (opsiyonel - veri varsa dikkatli olun)
-- ALTER TABLE "WeeklyHoroscope" DROP COLUMN "energy";
-- ALTER TABLE "WeeklyHoroscope" DROP COLUMN "career";

-- AlterTable: weekStart ve weekEnd'i DATE yap
ALTER TABLE "WeeklyHoroscope" ALTER COLUMN "weekStart" TYPE DATE USING ("weekStart"::date);
ALTER TABLE "WeeklyHoroscope" ALTER COLUMN "weekEnd" TYPE DATE USING ("weekEnd"::date);

-- CreateIndex
CREATE UNIQUE INDEX "DailyHoroscope_zodiacId_date_key" ON "DailyHoroscope"("zodiacId", "date");
CREATE INDEX "DailyHoroscope_date_idx" ON "DailyHoroscope"("date");
CREATE UNIQUE INDEX "WeeklyHoroscope_zodiacId_weekStart_key" ON "WeeklyHoroscope"("zodiacId", "weekStart");
CREATE INDEX "WeeklyHoroscope_weekStart_weekEnd_idx" ON "WeeklyHoroscope"("weekStart", "weekEnd");

-- AddForeignKey
ALTER TABLE "DailyHoroscope" ADD CONSTRAINT "DailyHoroscope_zodiacId_fkey" FOREIGN KEY ("zodiacId") REFERENCES "Zodiac"("id") ON DELETE CASCADE ON UPDATE CASCADE;
