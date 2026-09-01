import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail, sendLowStockEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const userId = intent.metadata.userId;
    const items = JSON.parse(intent.metadata.items ?? "[]");
    const total = intent.amount / 100;
    const couponId = intent.metadata.couponId;

    if (!userId || userId === "guest" || !items.length) {
      return NextResponse.json({ received: true });
    }

    try {
      // Check order not already created (idempotency)
      const existing = await db.order.findFirst({
        where: { paymentId: intent.id },
      });
      if (existing) return NextResponse.json({ received: true });

      const order = await db.order.create({
        data: {
          userId,
          total,
          status: "PAID",
          paymentId: intent.id,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      if (couponId) {
        await db.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Decrement stock for each purchased item
      await Promise.all(
        items.map((item: any) =>
          db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );
      // Fetch user + full order for email
      const [user, fullOrder] = await Promise.all([
        db.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true },
        }),
        db.order.findUnique({
          where: { id: order.id },
          include: {
            items: { include: { product: true } },
          },
        }),
      ]);

      if (user && fullOrder) {
        await sendOrderConfirmationEmail({
          name: user.name ?? "",
          email: user.email,
          order: fullOrder,
        });
      }
      // Check for low stock on purchased products
      const purchasedProductIds = items.map((i: any) => i.productId);
      const lowStockProducts = await db.product.findMany({
        where: {
          id: { in: purchasedProductIds },
          stock: { lte: 5 },
        },
        select: { name: true, stock: true, slug: true },
      });

      if (lowStockProducts.length > 0) {
        await sendLowStockEmail(lowStockProducts);
      }
    } catch (err) {
      console.error("Failed to create order:", err);
      return NextResponse.json(
        { error: "Order creation failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

export const runtime = "nodejs";
