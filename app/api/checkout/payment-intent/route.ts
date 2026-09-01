import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-08-26.dahlia",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { amount, items, couponId } = await req.json();

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: session?.user?.id ?? "guest",
        items: JSON.stringify(
          items?.map((item: any) => ({
            productId: item.productId ?? item.id,
            quantity: item.quantity,
            price: item.price ?? item.product?.price,
          })) ?? [],
        ),
        couponId: couponId ?? "",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
