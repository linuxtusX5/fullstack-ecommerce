import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  let status: string;
  try {
    const body = await req.text();
    console.log("Raw body:", body);
    const parsed = JSON.parse(body);
    status = parsed.status;
  } catch (err) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const valid = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await db.order.update({
    where: { id },
    data: { status: status as any },
  });
  return NextResponse.json(order);
}
