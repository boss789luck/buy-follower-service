import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { 
      service: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return <OrdersClient initialOrders={orders} />;
}
