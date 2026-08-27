import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  const { role } = await req.json();

  if (!["USER", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const user = await db.user.update({ where: { id }, data: { role } });
  return NextResponse.json(user);
}
