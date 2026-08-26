import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";

export async function GET() {
  await requireAdmin();
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });
  return NextResponse.json({ coupons });
}

export async function POST(req: Request) {
  await requireAdmin();
  const { code, type, value, minOrder, maxUses, expiresAt, active } =
    await req.json();

  if (!code || !type || !value) {
    return NextResponse.json(
      { error: "Code, type and value are required" },
      { status: 400 },
    );
  }

  const existing = await db.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Coupon code already exists" },
      { status: 400 },
    );
  }

  const coupon = await db.coupon.create({
    data: {
      code: code.toUpperCase().trim(),
      type,
      value: Number(value),
      minOrder: minOrder ? Number(minOrder) : null,
      maxUses: maxUses ? Number(maxUses) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: active ?? true,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}
