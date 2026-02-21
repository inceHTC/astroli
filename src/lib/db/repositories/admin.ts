import { prisma } from "../client";

export async function getAdminByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });
}
