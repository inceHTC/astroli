import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL ve ADMIN_PASSWORD .env dosyasında tanımlı olmalı.");
  }

  const hash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email: email.toLowerCase() },
    update: { password: hash },
    create: { email: email.toLowerCase(), password: hash },
  });

  console.log(`✓ Admin oluşturuldu: ${admin.email}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
