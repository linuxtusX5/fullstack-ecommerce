import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();

  const coupon = await db.coupon.update({
    where: { id },
    data: {
      ...(body.code !== undefined && { code: body.code.toUpperCase().trim() }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.value !== undefined && { value: Number(body.value) }),
      ...(body.minOrder !== undefined && {
        minOrder: body.minOrder ? Number(body.minOrder) : null,
      }),
      ...(body.maxUses !== undefined && {
        maxUses: body.maxUses ? Number(body.maxUses) : null,
      }),
      ...(body.expiresAt !== undefined && {
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      }),
      ...(body.active !== undefined && { active: body.active }),
    },
  });

  return NextResponse.json(coupon);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  await db.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
