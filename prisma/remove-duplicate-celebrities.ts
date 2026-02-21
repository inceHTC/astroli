/**
 * Aynı isimle kayıtlı tekrarlayan ünlü kayıtlarını temizler.
 * Her isim için en eski kayıt (createdAt) tutulur, diğerleri silinir.
 * Çalıştırma: npx tsx prisma/remove-duplicate-celebrities.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const all = await prisma.celebrity.findMany({
    orderBy: [{ name: "asc" }, { createdAt: "asc" }],
  });

  const byName = new Map<string, typeof all>();
  for (const c of all) {
    const key = c.name.trim().toLowerCase();
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key)!.push(c);
  }

  let deleted = 0;
  for (const [name, group] of byName) {
    if (group.length <= 1) continue;
    const [keep, ...toDelete] = group;
    console.log(`"${name}": ${group.length} kayıt, 1 tutuluyor (id: ${keep.id}), ${toDelete.length} silinecek.`);
    for (const c of toDelete) {
      await prisma.celebrity.delete({ where: { id: c.id } });
      deleted++;
    }
  }

  console.log(`\nToplam ${deleted} tekrar kayıt silindi.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
