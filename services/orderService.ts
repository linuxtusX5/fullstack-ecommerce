import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function createOrder({
  userId,
  items,
  addressId,
  stripePaymentId,
  subtotal,
  shippingCost,
  tax,
}: {
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  addressId: string;
  stripePaymentId: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
}) {
  const total = subtotal + shippingCost + tax;
  const orderNumber = `ORD-${nanoid(8).toUpperCase()}`;

  const order = await db.order.create({
    data: {
      orderNumber,
      userId,
      addressId,
      stripePaymentId,
      subtotal,
      shippingCost,
      tax,
      total,
      status: "CONFIRMED",
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });

  // Decrement stock
  await Promise.all(
    items.map((item) =>
      db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      }),
    ),
  );

  // Clear user cart
  await db.cartItem.deleteMany({ where: { userId } });

  return order;
}

export async function getUserOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
}
