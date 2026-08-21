import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { OrdersList } from "@/components/account/OrdersList";

export const metadata = { title: "Orders — My Account" };

async function getUserOrders(userId: string) {
  try {
    return await db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const user = await requireAuth();
  const orders = await getUserOrders(user.id!);

  return <OrdersList orders={orders} />;
}
