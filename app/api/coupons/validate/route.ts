import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json();

  if (!code?.trim()) {
    return NextResponse.json(
      { error: "Please enter a coupon code" },
      { status: 400 },
    );
  }

  const coupon = await db.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
  }

  if (!coupon.active) {
    return NextResponse.json(
      { error: "This coupon is no longer active" },
      { status: 400 },
    );
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json(
      { error: "This coupon has expired" },
      { status: 400 },
    );
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json(
      { error: "This coupon has reached its usage limit" },
      { status: 400 },
    );
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return NextResponse.json(
      {
        error: `Minimum order of $${coupon.minOrder.toFixed(2)} required for this coupon`,
      },
      { status: 400 },
    );
  }

  const discount =
    coupon.type === "PERCENTAGE"
      ? (subtotal * coupon.value) / 100
      : Math.min(coupon.value, subtotal);

  return NextResponse.json({
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount: Math.round(discount * 100) / 100,
  });
}
