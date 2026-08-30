import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AddFundsClient from "./AddFundsClient";

export default async function AddFundsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const deposits = await prisma.deposit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return <AddFundsClient deposits={deposits} />;
}
