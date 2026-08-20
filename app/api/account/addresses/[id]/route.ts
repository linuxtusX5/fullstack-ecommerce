import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { db } from "@/lib/db";
import { z } from "zod";

const Schema = z.object({
  label: z.string().min(1).max(32).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  line1: z.string().min(1).optional(),
  line2: z.string().optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  country: z.string().min(2).max(2).optional(),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});

async function getOwned(id: string, userId: string) {
  const addr = await db.address.findUnique({ where: { id } });
  if (!addr || addr.userId !== userId) return null;
  return addr;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const addr = await getOwned(id, session.user.id);
  if (!addr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { isDefault, ...data } = parsed.data;

  if (isDefault) {
    await db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const updated = await db.address.update({
    where: { id },
    data: { ...data, ...(isDefault !== undefined ? { isDefault } : {}) },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const addr = await getOwned(id, session.user.id);
  if (!addr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.address.delete({ where: { id } });

  // If we deleted the default, promote the next one
  if (addr.isDefault) {
    const next = await db.address.findFirst({
      where: { userId: session.user.id },
    });
    if (next)
      await db.address.update({
        where: { id: next.id },
        data: { isDefault: true },
      });
  }

  return NextResponse.json({ success: true });
}
