"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markReserveAsDone(currentTotalBalance: number) {
  await prisma.adminConfig.upsert({
    where: { id: "default" },
    update: { coveredUserBalance: currentTotalBalance },
    create: { id: "default", coveredUserBalance: currentTotalBalance }
  });

  revalidatePath("/admin");
}
